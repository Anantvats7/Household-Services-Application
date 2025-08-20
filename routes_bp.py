from flask import Blueprint,send_file
from flask_jwt_extended import  jwt_required
routes_bp = Blueprint('routes_bp', __name__)
from Celery.task import create_csv
from celery.result import AsyncResult



@routes_bp.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)

    if result.ready():
        return send_file(f'./Celery/user-downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready'}, 400



@routes_bp.get('/create-csv')
@jwt_required()
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}, 200


# from Celery.celery_schedule import send_monthly_activity_report
# send_monthly_activity_report.apply_async()