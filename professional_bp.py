from flask import Blueprint, request, jsonify, current_app as app, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity,create_access_token
from models import db, ServiceRequest, Professional,Service,Customer
from werkzeug.security import generate_password_hash, check_password_hash

professional_bp = Blueprint('professional_bp', __name__)

@professional_bp.route('/')
def home():
    return render_template('index.html')

@professional_bp.route('/professional/register', methods=['POST'])
def professional_register():
    data = request.get_json()
    emailid = data.get('email')
    password = data.get('password')
    fullname = data.get('fullname')
    service_id = data.get('service_id')
    address = data.get('address')
    pincode = data.get('pincode')
    phoneno = data.get('phoneno')
    experience=data.get('experience')
    if 'link' in data:
        documents=data.get('link')

    if Professional.query.filter_by(emailid=emailid).first():
        return {'message': 'Email ID already exists!'}, 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    new_professional = Professional(
            emailid=emailid,
            password=hashed_password,
            fullname=fullname,
            service_id=service_id,
            address=address,
            pincode=pincode,
            phoneno=phoneno,
            experience=experience,
            documents=documents
        )

    db.session.add(new_professional)
    db.session.commit()

    return {'message': 'Professional registered successfully!'}, 201

#view service 
@professional_bp.route('/professional/service',methods=['GET'])
def getservice():
    @app.cache.cached(timeout=5)
    def prof_service_cache():
        ss=Service.query.all()
        service_data = [{'service_id': s.serviceid, 'service_name': s.servicename} for s in ss]
        return jsonify(service=service_data),201
    response, status_code = prof_service_cache()
    response=response.get_json()
    return jsonify(response), status_code


@professional_bp.route('/professional/login', methods=['POST'])
def professional_login():
    data = request.get_json()
    emailid = data.get('email')
    password = data.get('password')

    professional = Professional.query.filter_by(emailid=emailid).first()

    if professional and check_password_hash(professional.password, password):
        # Check if the professional is approved
        if professional.isapprove == True:
            # If the professional is not approved or blocked
            if professional.status == 'blocked':
                return {'message': 'Your account is blocked. Please contact Admin.'}, 403
            else:
                access_token = create_access_token(identity={"id": professional.professionalid, "role": "professional"})
                return {
                    'access_token': access_token,
                    'id': professional.professionalid,
                    'fullname': professional.fullname,
                    'role':'professional'
                }, 200

        else:
            return {'message': 'Your account is not approved yet.'}, 403
    return {'message': 'Invalid credentials'}, 401


# View all service requests assigned to the logged-in professional
@professional_bp.route('/professional/service-requests', methods=['GET'])
@jwt_required()
def professional_dash():
    @app.cache.cached(timeout=5)
    def prof_dash_cache():
        claims = get_jwt_identity()
        if claims.get('role') != 'professional':
            return jsonify({'message': 'Access forbidden'}), 403
        professional_id = get_jwt_identity()['id']

        # Fetch all service requests assigned to this professional
        service_requests = ServiceRequest.query.filter_by(professional_id=professional_id).all()
        service_requests_data = [
            {
                'id': sr.id,
                'service_id': sr.service_id,
                'customer_id': sr.customer_id,
                'date_of_request': sr.date_of_request,
                'date_of_completion': sr.date_of_completion,
                'service_status': sr.service_status,
                'remarks': sr.remarks
            }
            for sr in service_requests
            if sr.service_status != 'closed'  and sr.service_status != 'rejected'
            ]

        service_requests_data_closed = [
            {
                'id': sr.id,
                'service_id': sr.service_id,
                'customer_id': sr.customer_id,
                'date_of_request': sr.date_of_request,
                'date_of_completion': sr.date_of_completion,
                'service_status': sr.service_status,
                'remarks': sr.remarks
            }
            for sr in service_requests
            if sr.service_status == 'closed'  or sr.service_status == 'rejected'
            ]
        
        if not service_requests_data and not service_requests_data_closed:
            return jsonify({'message': 'No active service requests found'}), 404
        
        return jsonify(services=service_requests_data,servicereq=service_requests_data_closed), 200
    response, status_code = prof_dash_cache()
    response=response.get_json()
    return jsonify(response), status_code


# Accept or reject a service request
@professional_bp.route('/service-requests/action/<int:request_id>', methods=['POST'])
@jwt_required()
def update_service_request_status(request_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'professional':
        return jsonify({'message': 'Access forbidden'}), 403
    professional_id = get_jwt_identity()['id']

    # Fetch the service request to be updated
    service_request = ServiceRequest.query.filter_by(id=request_id, professional_id=professional_id).first()
    if not service_request:
        return jsonify({'message': 'Service request not found or not assigned to you'}), 404

    data = request.json
    action = data.get('action')

    if action == 'accept':
        service_request.service_status = 'assigned'
    elif action == 'reject':
        service_request.service_status = 'rejected'
    else:
        return jsonify({'message': 'Invalid action'}), 400

    db.session.commit()
    return jsonify({'message': f'Service request {action}ed successfully'}), 200


# Close a service request after completing the service
@professional_bp.route('/service-requests/close/<int:request_id>', methods=['POST'])
@jwt_required()
def close_service_request(request_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'professional':
        return jsonify({'message': 'Access forbidden'}), 403
    professional_id = get_jwt_identity()['id']

    # Fetch the service request to be closed
    service_request = ServiceRequest.query.filter_by(id=request_id, professional_id=professional_id, service_status='assigned').first()

    if not service_request:
        return jsonify({'message': 'Service request not found or not assigned to you'}), 404

    service_request.service_status = 'closed'
    service_request.closedby='professional'
    service_request.date_of_completion = db.func.current_timestamp()

    db.session.commit()
    return jsonify({'message': 'Service request closed successfully'}), 200

#search
@professional_bp.route('/professional/search', methods=['POST'])
@jwt_required()
def search():
    claims = get_jwt_identity()
    if claims.get('role') != 'professional':
        return jsonify({'message': 'Access forbidden'}), 403
    professional_id = claims['id'] 

    data = request.json
    search = data.get('search')
    placeholder = data.get('place')

    # Query the ServiceRequest based on selected filter criteria
    query = ServiceRequest.query.filter(ServiceRequest.professional_id == professional_id)

    # Apply search filters based on selected option
    if placeholder == 'Name':
        query = query.join(Customer).filter(Customer.fullname.ilike(f'%{search}%'))
    elif placeholder == 'start_date':
        query = query.filter(ServiceRequest.date_of_request.ilike(f'%{search}%'))
    elif placeholder == 'end_date':
        query = query.filter(ServiceRequest.date_of_completion.ilike(f'%{search}%'))
    elif placeholder == 'status':
        query = query.filter(ServiceRequest.service_status.ilike(f'%{search}%'))

    service_requests_data = [
        {
            'service_request_id': s.id,
            'customer_name': s.customer.fullname,
            'status': s.service_status,
            'professional_name': s.professional.fullname,
            'service_name': s.service.servicename if s and s.service else None,
            'date': s.date_of_request,
        }
        for s in query.all()
    ]
    
    return jsonify(services=service_requests_data), 200
