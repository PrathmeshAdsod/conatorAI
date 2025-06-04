from flask import Flask, jsonify
from flask_cors import CORS
from app.api.routes import api

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    @app.route('/')
    def root():
        return jsonify({
            "message": "Welcome to the Content Generation API",
            "api_base": "/api"
        })
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    return app