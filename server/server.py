from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# 
# python -m flask --app server run
# 

@app.route('/test', methods=['POST'])
def test():
    data = request.get_json()
    print(data)
    return jsonify({'message': 'success'})