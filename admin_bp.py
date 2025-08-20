from flask import Blueprint, request, jsonify,current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, Customer, Professional, Service,ServiceRequest


admin_bp = Blueprint('admin_bp', __name__)

ADMIN_EMAIL = 'admin@household.com'
ADMIN_PASSWORD = 'admin_password'
# ADMIN_EMAIL = 'admin'
# ADMIN_PASSWORD = '1234'

# Admin login route
@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        access_token = create_access_token(identity={'role': 'admin'})
        return jsonify(access_token=access_token,role='admin',id=0,fullname='Admin'), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# View all customers and professionals and services and service requests
@admin_bp.route('/admin/customers', methods=['GET'])
@jwt_required()
def get_info():
    @current_app.cache.cached(timeout=5)
    def admin_dash_cache():
        claims = get_jwt_identity()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        customers = Customer.query.all()
        customer_data = [{'customerid': c.customerid, 
                        'fullname': c.fullname, 
                        'emailid': c.emailid, 
                        #'status': c.status
                        'status' : 'unblocked' if c.isblocked == 0 else 'blocked'

                        } 
                        for c in customers]
        
        professionals = Professional.query.all()
        professional_data = [{'professionalid': p.professionalid,
                            'fullname': p.fullname,
                                'emailid': p.emailid, 
                                'status': p.status
                                } 
                                for p in professionals]
        
        servicereq=ServiceRequest.query.all()
        service_req_data=[ {
                            'service_request_id': s.id,
                            'customer_name' : s.customer.fullname,
                            'status' : s.service_status,
                            'professional_name' : s.professional.fullname,
                            'service_name' : s.service.servicename if s and s.service else None,
                            'date' : s.date_of_request,
                        }
                        for s in servicereq]
        services=Service.query.all()
        service_data=[ {
                            'service_id': ss.serviceid,
                            'price' : ss.price,
                            'time' : ss.time_required,
                            'service_name' : ss.servicename,
                        }
                        for ss in services]

        return jsonify(customers=customer_data,professionals=professional_data,servicereq=service_req_data,services=service_data), 200
    response, status_code = admin_dash_cache()
    response=response.get_json()
    return jsonify(response), status_code


# Create a new service
@admin_bp.route('/admin/service', methods=['POST'])
@jwt_required()
def create_service():
    claims = get_jwt_identity()
    if claims.get('role') != 'admin':
        return jsonify({'message': 'Access forbidden'}), 403

    data = request.json
    new_service = Service(servicename=data.get('name_service'), price=data.get('price'), description=data.get('description'), time_required=data.get('time_required'))
    db.session.add(new_service)
    db.session.commit()

    return jsonify({'message': 'Service created successfully'}), 201


# display service
@admin_bp.route('/admin/service/view/<int:service_id>', methods=['GET'])
@jwt_required()
def display_service(service_id):
    @current_app.cache.cached(timeout=5)
    def admin_services_cache():
        claims = get_jwt_identity()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403
        ss=Service.query.get(service_id)
        service_data={
                            'service_id': ss.serviceid,
                            'price' : ss.price,
                            'time' : ss.time_required,
                            'service_name' : ss.servicename,
                            'description' : ss.description,
                        }
        return jsonify(sreq=service_data),200
    response, status_code = admin_services_cache()
    response=response.get_json()
    return jsonify(response), status_code
    

# Update service
@admin_bp.route('/admin/service/edit/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'admin':
        return jsonify({'message': 'Access forbidden'}), 403

    service = Service.query.get(service_id)
    if not service:
        return jsonify({'message': 'Service not found'}), 404

    data = request.json
    service.servicename = data.get('name', service.servicename)
    service.price = data.get('price', service.price)
    service.description = data.get('description', service.description)
    service.time_required = data.get('time_required', service.time_required)

    db.session.commit()
    return jsonify({'message': 'Service updated successfully'}), 200

# Delete service
@admin_bp.route('/admin/service/del/<int:service_id>', methods=['DELETE'])
@jwt_required()
def del_service(service_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'admin':
         return jsonify({'message': 'Access forbidden'}), 403

    service = Service.query.get(service_id)
    if not service:
        return jsonify({'message': 'Service not found'}), 404

    # "General Service" or NULL
    gen_service = Service.query.filter_by(servicename='General Service').first()

    # Update associated professionals and service requests
    if gen_service:
        Professional.query.filter_by(service_id=service_id).update({'service_id': gen_service.serviceid})
        ServiceRequest.query.filter_by(service_id=service_id).update({'service_id': gen_service.serviceid})
    else:
        Professional.query.filter_by(service_id=service_id).update({'service_id': None})
        ServiceRequest.query.filter_by(service_id=service_id).update({'service_id': None})

    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Service deleted successfully and service updated'}), 200


#view professional by id
@admin_bp.route('/admin/professional/<int:id>',methods=['GET'])
@jwt_required()
def get_professional_by(id):
    @current_app.cache.cached(timeout=5)
    def admin_prof_id_cache():
        claims=get_jwt_identity()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403
        prof=Professional.query.get(id)
        if not prof:
            return jsonify({'message': 'Professional not found'}), 404
        professional_data= {
                            'professional_id': prof.professionalid,
                            'professional_name' : prof.fullname,
                            'Address' : prof.address,
                            'Phone' : prof.phoneno,
                            'Pin' : prof.pincode,
                            'link':prof.documents,
                            'Status' : prof.status,
                            'Rating' : prof.average_rating,
                            'Email' : prof.emailid,
                            'isapprove':prof.isapprove,
                        }
                        
        return jsonify(prof=professional_data),200
    response, status_code = admin_prof_id_cache()
    response=response.get_json()
    return jsonify(response), status_code

# Approve a professional
@admin_bp.route('/admin/professional/approve/<int:professional_id>', methods=['POST'])
@jwt_required()
def approve_professional_by(professional_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'admin':
        return jsonify({'message': 'Access forbidden'}), 403

    professional = Professional.query.get(professional_id)
    if not professional:
        return jsonify({'message': 'Professional not found'}), 404

    professional.isapprove = True
    db.session.commit()

    return jsonify({'message': 'Professional approved successfully'}), 200

# Block/unblock a professional
@admin_bp.route('/admin/professional/block/<int:professional_id>', methods=['POST'])
@jwt_required()
def block_unblock_professional(professional_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'admin':
        return jsonify({'message': 'Access forbidden'}), 403

    professional = Professional.query.get(professional_id)
    if not professional:
        return jsonify({'message': 'Professional not found'}), 404

    data = request.json
    professional.status = data.get('status')

    db.session.commit()
    return jsonify({'message': f'Professional {professional.status} successfully'}), 200

#view service request by id
@admin_bp.route('/admin/servicerequest/<int:id>',methods=['GET'])
@jwt_required()
def get_service__request(id):
    @current_app.cache.cached(timeout=5)
    def admin_servicerequest_id_cache():
        claims=get_jwt_identity()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403
        sreq=ServiceRequest.query.get(id)
        if not sreq:
            return jsonify({'message': 'Service request not found'}), 404
        service_req_data= {
                            'service_request_id': sreq.id,
                            'customer_name' : sreq.customer.fullname,
                            'status' : sreq.service_status,
                            'professional_name' : sreq.professional.fullname,
                            'service_name' : sreq.service.servicename if sreq and sreq.service else None,
                            'request_date' : sreq.date_of_request,
                            'completion_date' : sreq.date_of_completion,
                        }
                        
        return jsonify(sreq=service_req_data),200
    response, status_code = admin_servicerequest_id_cache()
    response=response.get_json()
    return jsonify(response), status_code

#View customer by id
@admin_bp.route('/admin/customer/view/<int:id>', methods=['GET'])
@jwt_required()
def get_customer(id):
    @current_app.cache.cached(timeout=5)
    def admin_customer_id_cache():
        claims = get_jwt_identity()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        customer = Customer.query.get(id)
        customer_data = {'customerid': customer.customerid, 
                        'fullname': customer.fullname, 
                        'emailid': customer.emailid, 
                        'Address': customer.address,
                        'Phone': customer.phoneno,
                        'Pin' :customer.pincode,
                        } 
                        
        
        return jsonify(customer=customer_data), 200
    response, status_code = admin_customer_id_cache()
    response=response.get_json()
    return jsonify(response), status_code

# Block/unblock a customer
@admin_bp.route('/admin/customer/block/<int:customer_id>', methods=['POST'])
@jwt_required()
def block_customer(customer_id):
    claims = get_jwt_identity()
    if claims.get('role') != 'admin':
        return jsonify({'message': 'Access forbidden'}), 403

    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'message': 'Customer not found'}), 404

    data = request.json
    customer.isblocked = data.get('isblocked', False)

    db.session.commit()
    state="blocked" if customer.isblocked else "unblocked"
    return jsonify({'message': f'Customer {state} successfully'}), 200


#search
@admin_bp.route('/admin/search', methods=['POST'])
@jwt_required()
def search():
    claims = get_jwt_identity()
    if claims.get('role') != 'admin':
        return jsonify({'message': 'Access forbidden'}), 403

    data = request.json
    search = data.get('search', '')
    place = data.get('place', '')

    customer_data = []
    professional_data = []
    service_req_data = []
    service_data = []

    if place == 'Customer':
        customer_data = [
            {'customerid': c.customerid, 'fullname': c.fullname, 'emailid': c.emailid}
            for c in Customer.query.filter(
                (Customer.fullname.ilike(f'%{search}%')) |
                (Customer.address.ilike(f'%{search}%')) |
                (Customer.pincode.ilike(f'%{search}%'))
            ).all()
        ]
    elif place == 'Professional':
        professional_data = [
            {'professionalid': p.professionalid, 'fullname': p.fullname, 'emailid': p.emailid, 'status': p.status}
            for p in Professional.query.filter(
                (Professional.fullname.ilike(f'%{search}%')) |
                (Professional.status.ilike(f'%{search}%')) |
                (Professional.total_rating.ilike(f'%{search}%'))
            ).all()
        ]
    elif place == 'ServiceRequest':
        service_req_data = [
            {
                'service_request_id': s.id,
                'customer_name': s.customer.fullname,
                'status': s.service_status,
                'professional_name': s.professional.fullname,
                'service_name': s.service.servicename if s and s.service else None,
                'date': s.date_of_request,
            }
            for s in ServiceRequest.query.filter(
                (ServiceRequest.service_status.ilike(f'%{search}%')) |
                (ServiceRequest.date_of_request.ilike(f'%{search}%')) |
                (ServiceRequest.date_of_completion.ilike(f'%{search}%'))
            ).all()
        ]
    elif place == 'Service':
        service_data = [
            {
                'service_id': ss.serviceid,
                'price': ss.price,
                'time': ss.time_required,
                'service_name': ss.servicename,
            }
            for ss in Service.query.filter(
                (Service.servicename.ilike(f'%{search}%'))
            ).all()
        ]

    return jsonify(
        customers=customer_data,
        professionals=professional_data,
        servicereq=service_req_data,
        services=service_data
    ), 200




#---------------------chartjs


@admin_bp.route('/admin/generate-chart-data', methods=['GET'])
def generate_chart_data():
    servicereq = ServiceRequest.query.all()
    service_req_data = [{
                        'service_request_id': s.id,
                        'status': s.service_status,
                    }
                    for s in servicereq]

    # Count the occurrences of each service status
    status_counts = {}
    for s in service_req_data:
        status = s['status']
        status_counts[status] = status_counts.get(status, 0) + 1

    keys = list(status_counts.keys())
    data = list(status_counts.values())

    return jsonify({
        'labels': keys,
        'data': data,
    })
