from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date, timedelta
import os
from werkzeug.utils import secure_filename

db = SQLAlchemy()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    daily_goal = db.Column(db.Integer, default=2000)
    theme = db.Column(db.String(10), default='light')
    profile_picture = db.Column(db.String(120), default='default.png')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    entries = db.relationship('HydrationEntry', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_streak(self):
        entries = self.entries.order_by(HydrationEntry.date.desc()).all()
        streak = 0
        current_date = date.today()
        
        for entry in entries:
            if entry.date < current_date:
                break
            if entry.amount >= self.daily_goal:
                streak += 1
                current_date = current_date - timedelta(days=1)
            else:
                break
                
        return streak

class HydrationEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, default=date.today, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'date', name='_user_date_uc'),)

