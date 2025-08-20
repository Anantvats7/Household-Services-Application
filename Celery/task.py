from celery import shared_task
import time
from models import ServiceRequest
import flask_excel
from Celery.mail_service import send_email


@shared_task(bind = True, ignore_result = False)
def create_csv(self):
    service_requests = ServiceRequest.query.filter(ServiceRequest.service_status == 'closed' , ServiceRequest.closedby == 'professional').all()
    task_id = self.request.id
    filename = f'service_request_data_{task_id}.csv'
    column_names = [column.name for column in ServiceRequest.__table__.columns]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(service_requests, column_names = column_names, file_type='csv' )
    print(csv_out)
    with open(f'./Celery/user-downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(ignore_result = True)
def email_reminder(to, subject, content):
    send_email(to, subject, content)