# Hydratr — Water Intake Tracker

a small, responsive web app to help you actually drink water. built for people who forget to hydrate between coding sprints, meetings, and bad playlist decisions.

---

## why this exists

i made Hydratr because i kept forgetting to drink water during long coding sessions. it’s simple by design — no pressure, just an easy way to log sips, see progress, and keep a streak going.

---

## features

- **Daily logging** — log custom amounts or use quick presets (250ml, 500ml, 1L, 1.5L).
- **Progress visualization** — realtime progress bar + weekly charts.
- **Personal goals** — set a daily hydration goal.
- **Streaks** — track consecutive hydrated days.
- **Responsive UI** — works on desktop + mobile.
- **Export options** — PDF or JSON.
- **Gentle notifications** — reminders without nagging.

---

## tech stack

- **Backend**: Flask (Python)  
- **Database**: SQLite + SQLAlchemy  
- **Frontend**: HTML5 + Tailwind CSS + vanilla JS  
- **Charts**: Chart.js  
- **Auth**: Flask-Login  
- **PDF Export**: ReportLab

---

## quick start

**requirements**: python 3.10+, pip, git

```bash
git clone https://github.com/<your-username>/hydratr-enhanced.git
cd hydratr-enhanced

python -m venv venv
source venv/bin/activate     # mac/linux
venv\Scripts\activate      # windows

pip install -r requirements.txt
mkdir -p instance
python init_db.py
python app.py
```

the app runs at `http://localhost:5001`

---

## environment (example)

```env
FLASK_CONFIG=development
SECRET_KEY=dev-secret-change-me
DATABASE_URL=sqlite:///instance/hydratr.db
PORT=5001
```

---

## usage

1. sign up / log in  
2. set your daily goal  
3. log water with the form or quick buttons  
4. track progress + streaks  
5. export if needed  

---

## project structure

```
hydratr/
├── app.py
├── config.py
├── models.py
├── requirements.txt
├── routes/
│   ├── auth.py
│   ├── dashboard.py
│   └── export.py
├── static/
├── templates/
├── utils/
└── instance/
```

---

## contributing

1. fork the repo  
2. create a branch  
3. make your change  
4. test it  
5. open a PR  
