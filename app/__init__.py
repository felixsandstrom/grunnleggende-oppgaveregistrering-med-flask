from flask import Flask
from .extensions import db, migrate
from .config import DevelopmentConfig, ProductionConfig
import os

def create_app():
    app = Flask(__name__)

    # Load configuration
    if os.getenv('FLASK_ENV') == 'development':
        app.config.from_object(DevelopmentConfig)
    else:
        app.config.from_object(ProductionConfig)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from .views import views
    app.register_blueprint(views, url_prefix='/')

    return app
