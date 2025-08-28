from flask import Blueprint, send_file, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, date, timedelta
from models import HydrationEntry
from utils.pdf_export import generate_pdf_report
import json
import io

export_bp = Blueprint('export', __name__)

@export_bp.route('/export/pdf')
@login_required
def export_pdf():
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')
    
    if start_date_str and end_date_str:
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            start_date = date.today() - timedelta(days=30)
            end_date = date.today()
    else:
        start_date = date.today() - timedelta(days=30)
        end_date = date.today()
    
    entries = HydrationEntry.query.filter(
        HydrationEntry.user_id == current_user.id,
        HydrationEntry.date >= start_date,
        HydrationEntry.date <= end_date
    ).order_by(HydrationEntry.date.asc()).all()
    
    data = []
    for entry in entries:
        data.append({
            'date': entry.date.strftime('%Y-%m-%d'),
            'amount': entry.amount,
            'goal': current_user.daily_goal,
            'met_goal': entry.amount >= current_user.daily_goal
        })
    
    options = {
        'include_charts': request.args.get('include_charts', 'true') == 'true',
        'include_stats': request.args.get('include_stats', 'true') == 'true',
        'include_details': request.args.get('include_details', 'true') == 'true',
        'date_range': {
            'start': start_date.strftime('%Y-%m-%d'),
            'end': end_date.strftime('%Y-%m-%d')
        }
    }
    
    pdf_buffer = generate_pdf_report(data, current_user, options)
    
    filename = f'hydration_report_{date.today().strftime("%Y%m%d")}.pdf'
    
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf'
    )

@export_bp.route('/export/json')
@login_required
def export_json():
    entries = HydrationEntry.query.filter_by(
        user_id=current_user.id
    ).order_by(HydrationEntry.date.asc()).all()
    
    data = []
    for entry in entries:
        data.append({
            'date': entry.date.strftime('%Y-%m-%d'),
            'amount': entry.amount,
            'goal': current_user.daily_goal
        })
    
    return jsonify(data)

