import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60 * 24)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_REGION = os.getenv('AWS_REGION', 'eu-north-1')

class DevelopmentConfig(Config):
    S3_BUCKET_NAME = 'task-portal-demo-dev'
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL_DEV') + '/task_portal_demo'

class ProductionConfig(Config):
    S3_BUCKET_NAME = 'task-portal-demo-prod'
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_recycle': 280}
