from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime, date, timedelta
from models import db, HydrationEntry
import random

dashboard_bp = Blueprint('dashboard', __name__)

MOTIVATIONAL_MESSAGES = [
    "Sip sip hooray! You're doing great! 💧",
    "Water is life! Keep hydrating! 🌊",
    "Your body thanks you for each drop! 🙏",
    "Stay hydrated, stay healthy! 💪",
    "Every drop counts toward your goal! ⚡",
    "You're making waves with your hydration! 🌊",
    "Hydration is the key to energy! 🔋",
    "Keep going, you're on a roll! 🎯",
    "Your hydration journey is inspiring! ✨",
    "Water you waiting for? Drink up! 🚀"
]

@dashboard_bp.route('/')
@login_required
def index():
    today = date.today()
    today_entry = HydrationEntry.query.filter_by(
        user_id=current_user.id, 
        date=today
    ).first()
    
    today_entries = HydrationEntry.query.filter(
        HydrationEntry.user_id == current_user.id,
        HydrationEntry.date == today
    ).order_by(HydrationEntry.created_at.desc()).all()
    
    today_amount = today_entry.amount if today_entry else 0
    progress = min(100, (today_amount / current_user.daily_goal) * 100) if current_user.daily_goal > 0 else 0
    
    week_ago = today - timedelta(days=6)
    entries = HydrationEntry.query.filter(
        HydrationEntry.user_id == current_user.id,
        HydrationEntry.date >= week_ago
    ).order_by(HydrationEntry.date.asc()).all()
    
    chart_labels = []
    chart_data = []
    chart_goals = []
    
    for i in range(7):
        current_date = week_ago + timedelta(days=i)
        chart_labels.append(current_date.strftime('%a'))
        
        entry = next((e for e in entries if e.date == current_date), None)
        if entry:
            chart_data.append(entry.amount)
        else:
            chart_data.append(0)
            
        chart_goals.append(current_user.daily_goal)
    
    message = random.choice(MOTIVATIONAL_MESSAGES)
    
    streak = current_user.get_streak()
    
    return render_template('dashboard.html', 
                         today_amount=today_amount,
                         progress=progress,
                         chart_labels=chart_labels,
                         chart_data=chart_data,
                         chart_goals=chart_goals,
                         message=message,
                         streak=streak,
                         today_entries=today_entries)

@dashboard_bp.route('/log', methods=['POST'])
@login_required
def log_water():
    amount = request.form.get('amount', type=int)
    
    if not amount or amount <= 0:
        flash('Please enter a valid amount', 'error')
        return redirect(url_for('dashboard.index'))
    
    today = date.today()
    entry = HydrationEntry.query.filter_by(
        user_id=current_user.id, 
        date=today
    ).first()
    
    if entry:
        entry.amount += amount
    else:
        entry = HydrationEntry(user_id=current_user.id, amount=amount, date=today)
        db.session.add(entry)
    
    db.session.commit()
    flash(f'✅ Logged {amount}ml of water!', 'success')
    return redirect(url_for('dashboard.index'))

@dashboard_bp.route('/delete-entry/<int:entry_id>', methods=['POST'])
@login_required
def delete_entry(entry_id):
    entry = HydrationEntry.query.get_or_404(entry_id)
    
    if entry.user_id != current_user.id:
        return jsonify({'success': False, 'error': 'Unauthorized'})
    
    db.session.delete(entry)
    db.session.commit()
    
    return jsonify({'success': True})

@dashboard_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        daily_goal = request.form.get('daily_goal', type=int)
        theme = request.form.get('theme')
        
        if daily_goal and daily_goal > 0:
            current_user.daily_goal = daily_goal
        
        if theme in ['light', 'dark']:
            current_user.theme = theme
            
        db.session.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('dashboard.profile'))
    
    total_entries = HydrationEntry.query.filter_by(user_id=current_user.id).count()
    
    entries = HydrationEntry.query.filter_by(user_id=current_user.id).all()
    total_intake = sum(entry.amount for entry in entries) // 1000
    
    recent_entries = HydrationEntry.query.filter_by(
        user_id=current_user.id
    ).order_by(HydrationEntry.date.desc()).limit(10).all()
    
    return render_template('profile.html', 
                         total_entries=total_entries,
                         total_intake=total_intake,
                         recent_entries=recent_entries)

@dashboard_bp.route('/api/history')
@login_required
def api_history():
    period = request.args.get('period', 'week')
    
    if period == 'month':
        start_date = date.today() - timedelta(days=30)
    else:
        start_date = date.today() - timedelta(days=6)
    
    entries = HydrationEntry.query.filter(
        HydrationEntry.user_id == current_user.id,
        HydrationEntry.date >= start_date
    ).order_by(HydrationEntry.date.asc()).all()
    
    history = []
    for entry in entries:
        history.append({
            'date': entry.date.strftime('%Y-%m-%d'),
            'amount': entry.amount,
            'goal': current_user.daily_goal,
            'met_goal': entry.amount >= current_user.daily_goal
        })
    
    return jsonify(history)

@dashboard_bp.route('/update-theme', methods=['POST'])
@login_required
def update_theme():
    theme = request.json.get('theme')
    if theme in ['light', 'dark']:
        current_user.theme = theme
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Invalid theme'})

