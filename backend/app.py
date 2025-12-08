import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.orm import DeclarativeBase



class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)


def create_app():
    app = Flask(__name__)
    env = os.getenv("FLASK_ENV", "development")
    
    config_map = {
        "testing": "config.TestingConfig",
        "development": "config.DevelopmentConfig",
    }
    
    app.config.from_object(config_map.get(env))
    
    db.init_app(app)
    
    from api.views import register_routes
    register_routes(app=app, db=db) 
    
    Migrate(app=app, db=db)
    
    return app
