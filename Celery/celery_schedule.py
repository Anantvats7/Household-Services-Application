from celery.schedules import crontab
#from flask import current_app as app
from Celery.task import email_reminder
#from Celery.celery_factory import celery_init_app
from app import celery_app
from models import ServiceRequest,Customer
from datetime import datetime, timedelta
#celery_app = app.extensions['celery']

#evening daily reminders for professionals
@celery_app.task
def daily_reminders():
    service_requests = ServiceRequest.query.filter(ServiceRequest.service_status != 'closed').all()
    emailset=set()
    for prof in service_requests:
        emailset.add(prof.professional.emailid)
    for email in emailset:
        email_reminder(email,'Reminder to login','<h1>You have pending service requests to visit/accept/reject.</h1>')

# today = datetime.today()
# first_day_of_last_month = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
# last_day_of_last_month = today.replace(day=1) - timedelta(days=1)
first_day_of_last_month='2024-11-01'
last_day_of_last_month='2024-11-30'

#monthly reminders
@celery_app.task
def send_monthly_activity_report():

    #first_day_of_current_month = today.replace(day=1)
    # Move to the first day of the next month and subtract a day
    #last_day_of_current_month = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)

    customers = Customer.query.all()
    for customer in customers:
        requests = ServiceRequest.query.filter(
            ServiceRequest.customer_id == customer.customerid,
            ServiceRequest.date_of_request >= first_day_of_last_month,
            ServiceRequest.date_of_request <= last_day_of_last_month
        ).all()


        report_html = f"""
        <html>
        <body>
            <h2>Monthly Activity Report</h2>
            <p>Dear {customer.fullname},</p>
            <p>Here is a summary of your service requests for the past month:</p>
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Service Date</th>
                    <th>Service Type</th>
                    <th>Status</th>
                </tr>
        """
        for request in requests:
            report_html += f"""
                <tr>
                    <td>{request.date_of_request.strftime('%Y-%m-%d')}</td>
                    <td>{request.service.servicename if request and request.service else None}</td>
                    <td>{request.service_status}</td>
                </tr>
            """
        report_html += """
            </table>
            <p>Thank you for using our services!</p>
        </body>
        </html>
        """
        email=customer.emailid
        email_reminder(email, 'Your Monthly Activity Report', report_html)


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    # daily message at 6:55 pm

    sender.add_periodic_task(crontab(hour=18, minute=30), daily_reminders.s(),name='daily pending service reminder')
    #sender.add_periodic_task(60.0, daily_reminders.s(),name='daily pending service reminder')
    
    # Add periodic task to run on the first day of every month

    #sender.add_periodic_task(60.0,send_monthly_activity_report.s(),name='monthly activity report')
    sender.add_periodic_task(crontab(day_of_month=1, hour=0, minute=0),send_monthly_activity_report.s(),name='monthly activity report')




