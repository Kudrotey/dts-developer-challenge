from flask import request, jsonify
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from api.models import Task as TaskResponse
from database.models import Task


def register_routes(app, db):
    
    @app.route("/api/tasks", methods=["POST"])
    def create_task():
        try:
            data = TaskResponse.model_validate(request.json)
            
            task = Task(
                title=data.title,
                description=data.description,
                status=data.status,
                due_date_time=data.due_date_time,
            )

            db.session.add(task)
            db.session.commit()
            
            return TaskResponse.model_validate(task).model_dump(), 200
        
        except ValidationError as e:
            return jsonify({"error": "Invalid input", "details": e.errors()}), 400

        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "Database error", "details": str(e)}), 500
        
        except Exception as e:
            return jsonify({"error": "Server error", "details": str(e)}), 500

