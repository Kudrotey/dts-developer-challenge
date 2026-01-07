from flask import request, jsonify
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import NotFound

from api.models import Task as TaskResponse, TaskUpdate
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
            db.session.rollback()
            return jsonify({"error": "Server error", "details": str(e)}), 500


    @app.route("/api/tasks", methods=["GET"])
    def get_tasks():
        try:
            tasks = db.session.execute(db.select(Task)).scalars()
            tasks_list = [TaskResponse.model_validate(task).model_dump() for task in tasks]
            
            if len(tasks_list) == 0:
                return jsonify({"error": "No tasks found"}), 404
            return tasks_list, 200
        
        except Exception as e:
            return jsonify(str(e)), 500
        
        
    @app.route("/api/tasks/<int:id>", methods=["GET"])
    def get_task(id):
        try:
            task = db.get_or_404(Task, id)
            return TaskResponse.model_validate(task).model_dump(), 200
        
        except NotFound:
                return jsonify({"error": "No task found"}), 404
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    
    @app.route("/api/tasks/<int:id>", methods=["DELETE"])
    def delete_task(id):
        try:
            task = db.session.execute(db.select(Task).filter_by(id=id)).scalar_one()
            db.session.delete(task)
            db.session.commit()
            return jsonify({"message": "Successfully deleted"}), 200
        
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "Database error", "details": str(e)}), 500

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Server error", "details": str(e)}), 500
        
        
    @app.route("/api/tasks/<int:id>", methods=["PATCH"])
    def update_task(id):
        try:
            partial_data = TaskUpdate.model_validate(request.json)
            task = db.session.execute(db.select(Task).filter_by(id=id)).scalar_one()

            if partial_data.status:
                task.status = partial_data.status
                
            db.session.commit()
            
            return TaskResponse.model_validate(task).model_dump(), 200
        
        except ValidationError as e:
            return jsonify({"error": "Invalid status", "details": e.errors()}), 400
        
        except NotFound:
                return jsonify({"error": "No task found"}), 404
            
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "Database error", "details": str(e)}), 500
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Server error", "details": str(e)}), 500
            