#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

PORT="${1:-}"

if [ -z "$PORT" ]; then
  echo "Usage: $0 <PORT>"
  exit 1
fi

command -v python3 >/dev/null 2>&1 || { echo "python3 not found"; exit 1; }

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi


source venv/bin/activate

python3 -m pip install --upgrade pip setuptools wheel

if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

if [ -f init_db.py ]; then

  if [ ! -f instance.db ]; then
    echo "running init_db.py..."
    python3 init_db.py || true
  else
    echo "instance.db found — skipping init_db.py"
  fi
fi

export FLASK_ENV=production
export PORT="$PORT"

if command -v gunicorn >/dev/null 2>&1 ; then
  echo "starting gunicorn on 127.0.0.1:$PORT"
  exec gunicorn --workers 3 --bind "127.0.0.1:${PORT}" app:app
else
  echo "gunicorn not found; falling back to python app.py (dev server) on port $PORT"
  exec python3 app.py --port "$PORT" || exec python3 app.py
fi
