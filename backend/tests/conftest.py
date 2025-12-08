import pytest
from app import create_app, db
from config import TestingConfig

@pytest.fixture(scope="session")
def app():
    app = create_app()
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()
        
@pytest.fixture(scope="function", autouse=True)
def clean_tables(app):
    with app.app_context():
        for table in reversed(db.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
    
@pytest.fixture(scope="session")
def client(app):
    return app.test_client()
    