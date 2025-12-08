
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
