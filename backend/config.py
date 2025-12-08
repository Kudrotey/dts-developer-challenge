import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class BaseConfig:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = False
    DEBUG = False

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    DB_PATH = os.path.join(BASE_DIR, "db", "dev_db.db")
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"

class TestingConfig(BaseConfig):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:" # SQLite in-memory DB
