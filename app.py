from flask import Flask
from models import db
from customer_bp import customer_bp
from professional_bp import professional_bp
from admin_bp import admin_bp
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
from routes_api import initialize_routes, check_if_token_in_blacklist
from flask_restful import Api
from flask_caching import Cache
import flask_excel as excel
 
from Celery.celery_factory import celery_init_app

def createApp():
    app = Flask(__name__,static_url_path='/static')

# Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///services.db'
    app.config['JWT_SECRET_KEY'] = 'supersecretkey'

    app.config['JWT_HEADER_NAME'] = 'Authentication-Token'  
    app.config['JWT_HEADER_TYPE'] = ''
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=60)  

# cache specific
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300     #30
    app.config["DEBUG"] = True
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_PORT"] = 6379


# Initialize JWT Manager and DB
    db.init_app(app)
    

    cache=Cache(app)
    app.cache=cache
    
    excel.init_excel(app)


    with app.app_context():
        db.create_all()
    
    jwt = JWTManager(app)
    api = Api(app)
    jwt.token_in_blocklist_loader(check_if_token_in_blacklist)
    initialize_routes(api)

    return app


app = createApp()

celery_app = celery_init_app(app)


#Register blueprints
app.register_blueprint(customer_bp)
app.register_blueprint(professional_bp)
app.register_blueprint(admin_bp)
from routes_bp import routes_bp
app.register_blueprint(routes_bp)
#import routes_bp
import Celery.celery_schedule


if __name__ == '__main__':
    app.run(debug=True)
    
