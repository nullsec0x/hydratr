from app import create_app
from models import db
import sqlite3
import os

app = create_app()

db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')

with app.app_context():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("PRAGMA table_info(user)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'profile_picture' not in columns:
            print("Adding profile_picture column to user table...")
            cursor.execute('ALTER TABLE user ADD COLUMN profile_picture VARCHAR(120) DEFAULT "default.png"')
            conn.commit()
            print("Database updated successfully!")
        else:
            print("profile_picture column already exists.")
            
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")