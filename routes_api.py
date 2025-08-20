
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

# Global set for token blacklisting
blacklist = set()

# Check if token is in blacklist
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklist

# Resource for logging out
class Logout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        blacklist.add(jti)
        return {'message': 'Successfully logged out'}, 200

    

# Function to initialize routes
def initialize_routes(api):
    api.add_resource(Logout, '/logout')


