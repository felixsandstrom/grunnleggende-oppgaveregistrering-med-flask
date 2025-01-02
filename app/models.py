from . import db
from datetime import datetime


class Tasks(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.String(100), nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    priority = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(200))



