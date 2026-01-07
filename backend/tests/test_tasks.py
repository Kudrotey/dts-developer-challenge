from datetime import datetime

from app import db
from database.models import Task


def test_create_task_success(client):
    payload = {
        "title": "Test Task",
        "description": "Test description",
        "status": "pending",
        "due_date_time": "2025-12-10T15:30:00"
    }
    
    response = client.post("/api/tasks", json=payload)
    
    assert response.status_code == 200
    
    data = response.get_json()

    assert data["id"] is not None
    assert data["title"] == "Test Task"
    assert data["status"] == "pending"
    assert data["due_date_time"] == "Wed, 10 Dec 2025 15:30:00 GMT"
    

def test_create_task_validation_error(client):
    payload = {
        "title": "Clean Room",
        "status": 123,
        "due_date_time": "2025-12-10T15:30:00"
    }

    response = client.post("/api/tasks", json=payload)

    assert response.status_code == 400

    data = response.get_json()
    assert "error" in data


def test_create_task_internal_server_error(client, monkeypatch):
    def crash():
        raise Exception("DB is down")

    monkeypatch.setattr("database.models.db.session.commit", crash)

    payload = {
        "title": "Test task",
        "description": "Will crash",
        "status": "pending",
        "due_date_time": "2025-12-01T12:00:00"
    }

    response = client.post("/api/tasks", json=payload)

    assert response.status_code == 500

    data = response.get_json()
    assert data["error"] == "Server error"
    assert "DB is down" in data["details"]
    
    
def test_get_tasks_success(client):
    t1 = Task(title="Task1",
              description="Desc1",
              status="pending",
              due_date_time=datetime(2025, 12, 10))
    
    t2 = Task(title="Task2",
        description="Desc2",
        status="pending",
        due_date_time=datetime(2025, 12, 10))

    db.session.add_all([t1, t2])
    db.session.commit()
    
    response = client.get("/api/tasks")
    data = response.get_json()
    
    assert len(data) == 2


def test_get_tasks_returns_no_tasks(client):
    response = client.get("/api/tasks")
    data = response.get_json()
    
    assert data["error"] == "No tasks found"
    
    
def test_get_task_success(client):
    t1 = Task(title="Task1",
            description="Desc1",
            status="pending",
            due_date_time=datetime(2025, 12, 10))
    
    db.session.add(t1)
    db.session.commit()
    
    response = client.get("/api/tasks/1")
    data = response.get_json()
    print(f"NOT FOUND: {data}")
    assert data == {
                    "id": 1,
                    "title": "Task1",
                    "description": "Desc1",
                    "status": "pending",
                    "due_date_time": "Wed, 10 Dec 2025 00:00:00 GMT"}
    

def test_get_tasks_returns_no_tasks(client):
    response = client.get("/api/tasks/1")
    data = response.get_json()
    
    assert data["error"] == "No task found"


def test_delete_task_success(client):
    t1 = Task(title="Task1",
            description="Desc1",
            status="pending",
            due_date_time=datetime(2025, 12, 10))
    
    db.session.add(t1)
    db.session.commit()
    
    response = client.delete("/api/tasks/1")
    data = response.get_json()
    
    assert data["message"] == "Successfully deleted"
    
    
def test_update_task_success(client):
    t1 = Task(title="Task1",
        description="Desc1",
        status="pending",
        due_date_time=datetime(2025, 12, 10))
    
    db.session.add(t1)
    db.session.commit()
    
    update_payload = {"status": "finished"}
    
    response = client.patch("/api/tasks/1", json=update_payload)
    data = response.get_json()
    
    assert data["status"] == "finished"
    assert data["description"] == "Desc1"
    
    
