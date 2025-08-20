from flask import Blueprint, request, jsonify,current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity,create_access_token
from models import Professional, db, Service, ServiceRequest,Customer,Professional
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re

customer_bp = Blueprint('customer_bp', __name__)

@customer_bp.route('/customer/register', methods=['POST'])
def customer_register():
    data = request.get_json()
    emailid = data.get('email')
    password = data.get('password')
    fullname = data.get('fullname')
    address = data.get('address')
    pincode = data.get('pincode')
    phoneno = data.get('phoneno')
    
    # Validate name
    name = data.get('fullname')
    if not name or len(name) < 3 or len(name) > 50:
        return {'message':"Name must be between 3 and 50 characters."},400

    # Validate email
    email = data.get('email')
    if not email or '@' not in email or  not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {'message':"Invalid email address."},400

    if Customer.query.filter_by(emailid=emailid).first():
        return {'message': 'Email ID already exists!'}, 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    new_customer = Customer(
            emailid=emailid,
            password=hashed_password,
            fullname=fullname,
            address=address,
            pincode=pincode,
            phoneno=phoneno, 
    )

    db.session.add(new_customer)
    db.session.commit()

    return {'message': 'Customer registered successfully!'}, 201

@customer_bp.route('/customer/login', methods=['POST'])
def customer_login():
    data = request.get_json()
    emailid = data.get('email')
    password = data.get('password')

    customer = Customer.query.filter_by(emailid=emailid).first()
    if customer and check_password_hash(customer.password, password):
        if customer.isblocked==False:
            access_token = create_access_token(identity={"id": customer.customerid, "role": "customer"})
            return {
                'access_token': access_token,
                'id': customer.customerid,
                'fullname': customer.fullname,
                'role': 'customer'
            }, 200
        else:
            return {'message':'User is blocked'},403

    return {'message': 'Invalid credentials'}, 401

# customer dashboard
@customer_bp.route('/customer/dash', methods=['GET'])
@jwt_required()
def customer_dash():
    @app.cache.cached(timeout=5)
    def customer_dash_cache():
        claims = get_jwt_identity()
        if claims.get('role') != 'customer':
            return jsonify({'message': 'Access forbidden'}), 403
        customer_id = get_jwt_identity()['id']

        services = Service.query.all()

        service_data = [
            {
                'service_id': service.serviceid,
                'service_name': service.servicename,
                'description': service.description,
                'price': service.price,
                'time': service.time_required
            }
            for service in services
        ]

        service_requests=ServiceRequest.query.filter_by(customer_id=customer_id).all()
        service_requests_data = [
            {
                'id': sr.id,
                'service_id': sr.service_id,
                'customer_id': sr.customer_id,
                's_date': sr.date_of_request,
                'date_of_completion': sr.date_of_completion,
                'service_status': sr.service_status,
                'remarks': sr.remarks,
                'service_name':sr.service.servicename if sr and sr.service else None,
                'prof_name':sr.professional.fullname,
                'closedby':sr.closedby,
            }
            for sr in service_requests
            ]

        return jsonify(services=service_data,service_requests=service_requests_data), 200
    response, status_code = customer_dash_cache()
    response=response.get_json()
    return jsonify(response), status_code


#display professional based on total rating given service
@customer_bp.route('/customer/professional/<int:service_id>', methods=['GET'])
@jwt_required()
def search_professional_by_services(service_id):
    services = Service.query.filter_by(serviceid=service_id).first()
    if not services:
        return jsonify({'message': 'Service not found'}), 404
    service_data = []
    professionals = Professional.query.filter_by(service_id=service_id).all()
        
        
    service_entry = {
                'service_id': services.serviceid,
                'service_name': services.servicename,
                'service_description': services.description,
                'service_price': services.price,
                'time_required': services.time_required,
                'professionals': []
            }
        
        
    for professional in professionals:
        service_entry['professionals'].append({
                'professional_id': professional.professionalid,
                'fullname': professional.fullname,
                'average_rating': professional.average_rating or 0  # Handle cases where no rating exists
        })
    service_entry['professionals'].sort(key=lambda x: x['average_rating'], reverse=True)
    if service_entry['professionals']:  # Check if there are any professionals
            service_data.append(service_entry)

        
    return jsonify(services=service_data), 200

# Create a service request
@customer_bp.route('/customer/request/<int:professional_id>/<int:service_id>', methods=['POST'])
@jwt_required()
def create_service_requests(professional_id, service_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'customer':
        return jsonify({'message': 'Access forbidden'}), 403

    # Validate if the professional and service exist
    professional = Professional.query.get(professional_id)
    service = Service.query.get(service_id)

    if not professional or not service:
        return jsonify({'message': 'Professional or Service not found'}), 404

    new_request = ServiceRequest(
        service_id=service_id,  
        customer_id=claims['id'],
        professional_id=professional_id,  
        service_status='requested',
        date_of_request=datetime.utcnow()  # Set the current date and time
    )
    
    db.session.add(new_request)
    db.session.commit()

    return jsonify({'message': 'Service request created successfully'}), 201


# Close a service request
@customer_bp.route('/customer/request/close/<int:request_id>', methods=['POST'])
@jwt_required()
def close_customer_requests(request_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'customer':
        return jsonify({'message': 'Access forbidden'}), 403

    service_request = ServiceRequest.query.get(request_id)
    if not service_request or service_request.customer_id != claims.get('id'):
        return jsonify({'message': 'Service request not found or unauthorized'}), 404

    service_request.service_status = 'closed'
    service_request.closedby='customer'
    service_request.date_of_completion = db.func.current_timestamp()
    
    db.session.commit()
    return jsonify({'message': 'Service request closed successfully'}), 200


@customer_bp.route('/customer/request/review/<int:request_id>', methods=['POST'])
@jwt_required()
def review(request_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'customer':
        return jsonify({'message': 'Access forbidden'}), 403

    service_request = ServiceRequest.query.get(request_id)

    # Ensure the service request exists, is assigned to this customer, and is completed
    if not service_request or service_request.customer_id != claims.get('id') or service_request.service_status != 'closed':
        return jsonify({'message': 'Service request not found, unauthorized, or not completed'}), 404

    data = request.json
    rating = data.get('rating')
    review=data.get('review')

    service_request.remarks=review

    # Validate rating (must be between 1 and 5)
    if rating is None or not (1 <= int(rating) <= 5):
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    # Fetch the professional related to this service request
    professional = Professional.query.get(service_request.professional_id)

    if not professional:
        return jsonify({'message': 'Professional not found'}), 404

    # Update professional's rating
    professional.total_rating += int(rating)
    professional.rating_count += 1

    db.session.commit()

    return jsonify({'message': 'Rating submitted successfully', 'average_rating': professional.average_rating}), 201

#get service request by id
@customer_bp.route('/customer/request/view/<int:id>',methods=['GET'])
@jwt_required()
def view(id):
    @app.cache.cached(timeout=5)
    def customer_servicerequest_cache():
        claims=get_jwt_identity()
        if claims.get('role')!='customer':
            return {'message':'Access forbiden'},403
        sr=ServiceRequest.query.filter_by(id=id).first()
        if sr is None:
            return {'message': 'Service request not found'}, 404
        service_requests_data = {
                'id': sr.id,
                'service_id': sr.service_id ,
                'customer_id': sr.customer_id,
                's_date': sr.date_of_request,
                'date_of_completion': sr.date_of_completion,
                'service_status': sr.service_status,
                'remarks': sr.remarks,
                'service_name':sr.service.servicename if sr and sr.service else None,
                'prof_name':sr.professional.fullname,
                
            }
        return jsonify(sreq=service_requests_data),200
    response, status_code = customer_servicerequest_cache()
    response=response.get_json()
    return jsonify(response), status_code
#-----------------edit

@customer_bp.route('/customer/request/edit/<int:request_id>', methods=['PUT'])
@jwt_required()
def edit_service_request(request_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'customer':
        return jsonify({'message': 'Access forbidden'}), 403

    # Fetch the service request to be edited
    service_request = ServiceRequest.query.filter_by(id=request_id, customer_id=claims['id']).first()

    if not service_request:
        return jsonify({'message': 'Service request not found or not assigned to you'}), 404

    data = request.json

    # If professional_id is provided, validate and update it
    if 'professional_id' in data:
        professional = Professional.query.get(data['professional_id'])
        if not professional:
            return jsonify({'message': 'Professional not found'}), 404
        service_request.professional_id = data['professional_id']

    # If service_id is provided, validate and update it
    if 'service_id' in data:
        service = Service.query.get(data['service_id'])
        if not service:
            return jsonify({'message': 'Service not found'}), 404
        service_request.service_id = data['service_id']

    # update the service status if provided
    if 'status' in data:
        service_request.service_status = data['status']

    #  update the remarks 
    if 'remarks' in data:
        service_request.remarks = data['remarks']

    
    if data.get('start_date') and len(data['start_date']) > 0:
        date_of_request = datetime.strptime(data['start_date'], '%Y-%m-%dT%H:%M')
        service_request.date_of_request = date_of_request

    db.session.commit()

    return jsonify({'message': 'Service request updated successfully'}), 200

#search
@customer_bp.route('/customer/search', methods=['POST'])
@jwt_required()
def search():
    claims = get_jwt_identity()
    if claims.get('role') != 'customer':
        return jsonify({'message': 'Access forbidden'}), 403

    data = request.json
    search = data.get('search')
    placeholder = data.get('place')

    if placeholder == 'Service Name':
        query = Professional.query.join(Service).filter(Service.servicename.ilike(f'%{search}%'))
    elif placeholder == 'Pin code':
        query = Professional.query.filter(Professional.pincode.ilike(f'%{search}%'))
    elif placeholder == 'Address':
        query = Professional.query.filter(Professional.address.ilike(f'%{search}%'))
    elif placeholder == 'Ratings':
        query = Professional.query.filter(Professional.total_rating.ilike(f'%{search}%'))

    service_requests_data = [
        {
            'service_id': s.service.serviceid if s and s.service else None,
            'professional_id':s.professionalid,
            'professional_name': s.fullname,
            'pin': s.pincode,
            'address': s.address,
            'service_name': s.service.servicename if s and s.service else None,
            'ratings': s.average_rating,
        }
        for s in query.all()
    ]
    
    return jsonify(services=service_requests_data), 200
#location,name,piincode