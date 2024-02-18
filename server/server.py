from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# 
# python -m flask --app server run
# 

last_shoulder_position = None # (left shoulder, right shoulder)
@app.route('/save_shoulder_position', methods=['Post'])
def saveShoulderPosition():
    global last_shoulder_position
    
    data = request.json
    print(data)
    
    if 'position' not in data:
        return jsonify({'status': 'error', 'message': 'Position not found'})
    
    last_shoulder_position = data['position']
    
    return jsonify({'status': 'ok'})

@app.route('/get_shoulder_position', methods=['Get'])
def getShoulderPosition():
    global last_shoulder_position
    return jsonify({'status': 'ok', 'shoulder_position': last_shoulder_position})


last_hand_position = None # (hand shoulder, hand shoulder)
@app.route('/save_hand_position', methods=['Post'])
def saveHandPosition():
    global last_hand_position
    
    data = request.json
    print(data)
    
    if 'position' not in data:
        return jsonify({'status': 'error', 'message': 'Position not found'})
    
    last_hand_position = data['position']
    
    return jsonify({'status': 'ok'})

@app.route('/get_hand_position', methods=['Get'])
def getHandPosition():
    global last_hand_position
    return jsonify({'status': 'ok', 'hand_position': last_hand_position})


last_elbo_position = None # (left elbo, right elbo)
@app.route('/save_elbo_position', methods=['Post'])
def saveElboPosition():
    global last_elbo_position
    
    data = request.json
    print(data)
    
    if 'position' not in data:
        return jsonify({'status': 'error', 'message': 'Position not found'})
    
    last_elbo_position = data['position']
    
    return jsonify({'status': 'ok'})

@app.route('/get_elbo_position', methods=['Get'])
def getElboPosition():
    global last_elbo_position
    return jsonify({'status': 'ok', 'elbo_position': last_elbo_position})

# everything else ___________________________________________________________________________________
@app.route('/get_everything', methods=['Get'])
def getEverything():
    global last_expression, last_shoulder_position
    return jsonify({'status': 'ok', 'expression': last_expression, 'shoulder_position': last_shoulder_position, 'hand_position': last_hand_position, 'elbo_position': last_elbo_position})

last_expression = None
@app.route('/save_expression', methods=['POST'])
def saveExpression():
    global last_expression
    
    data = request.json
    print(data)
    
    if 'expression' not in data:
        return jsonify({'status': 'error', 'message': 'Expression not found'})
    
    last_expression = data['expression']
    
    return jsonify({'status': 'ok'})

@app.route('/get_expression', methods=['Get'])
def getExpression():
    global last_expression
    return jsonify({'status': 'ok', 'expression': last_expression})

# Saving Names _______________________________________________________________________________________
nanny_name = 'Sally'

@app.route('/save_name', methods=['POST'])
def save_nanny_name():
    global nanny_name
    
    data = request.json
    print(data)
    
    if 'name' not in data:
        return jsonify({'status': 'error', 'message': 'name not found'})
    
    nanny_name = data['name']
    
    return jsonify({'status': 'ok'})

coach_name = 'Sam'

@app.route('/save_name', methods=['POST'])
def save_coach_name():
    global coach_name
    
    data = request.json
    print(data)
    
    if 'name' not in data:
        return jsonify({'status': 'error', 'message': 'name not found'})
    
    coach_name = data['name']
    
    return jsonify({'status': 'ok'})

teacher_name = 'Alex'

@app.route('/save_name', methods=['POST'])
def save_teacher_name():
    global teacher_name
    
    data = request.json
    print(data)
    
    if 'name' not in data:
        return jsonify({'status': 'error', 'message': 'name not found'})
    
    teacher_name = data['name']
    
    return jsonify({'status': 'ok'})

