from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
class Customer(db.Model):
    __tablename__ = 'customer'
    
    customerid = db.Column(db.Integer, primary_key=True)
    emailid = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255))
    pincode = db.Column(db.String(6), nullable=False)
    phoneno = db.Column(db.String(15), nullable=False)
    isblocked = db.Column(db.Boolean, default=False)
    # 1-to-Many relationship with ServiceRequest
    service_requests = db.relationship('ServiceRequest', backref='customer', lazy=True)


class Professional(db.Model):
    __tablename__ = 'professional'
    
    professionalid = db.Column(db.Integer, primary_key=True)
    emailid = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('service.serviceid'), )  # Linked to one Service
    documents = db.Column(db.String(255))  
    experience = db.Column(db.Float,nullable=False)
    address = db.Column(db.String(255))
    pincode = db.Column(db.String(6), nullable=False)
    phoneno = db.Column(db.String(15), nullable=False)
    isapprove = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(50), nullable=False, default="unblocked")  # e.g., unblock/block
    total_rating = db.Column(db.Float, default=0)    # Sum of all ratings
    rating_count = db.Column(db.Integer, default=0)  # Number of ratings

    service_requests = db.relationship('ServiceRequest', backref='professional', lazy=True)

    @property
    def average_rating(self):
        if self.rating_count == 0:
            return 0
        return self.total_rating / self.rating_count
    # 1-to-Many relationship with ServiceRequest

class Service(db.Model):
    __tablename__ = 'service'
    
    serviceid = db.Column(db.Integer, primary_key=True)
    servicename = db.Column(db.String(100), nullable=False)  
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    time_required = db.Column(db.String(50))  
    # 1-to-Many relationship with Professional and ServiceRequest
    professionals = db.relationship('Professional', backref='service', lazy=True)
    service_requests = db.relationship('ServiceRequest', backref='service', lazy=True)


class ServiceRequest(db.Model):
    __tablename__ = 'service_request'
    
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.serviceid'), )
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.customerid'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professional.professionalid'))  
    date_of_request = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    date_of_completion = db.Column(db.DateTime)
    service_status = db.Column(db.String(50), nullable=False)  # requested/assigned/closed
    remarks = db.Column(db.String(255))  
    closedby=db.Column(db.String(255))

#service_id = db.Column(db.Integer, db.ForeignKey('service.serviceid', ondelete='SET NULL'), nullable=True)
