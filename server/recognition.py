import requests
import json

import cv2 
import mediapipe as mp
from deepface import DeepFace


# http://127.0.0.1:5000

def save_expression(expression):
    # Save the expression
    url = 'http://127.0.0.1:5000'
    data = {'expression': expression}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url + '/save_expression', data=json.dumps(data), headers=headers)
        print(response.json())
    except Exception as e:
        print('Error:', e)
        
def save_shoulder_position(left_shoulder, right_shoulder):
    url = 'http://127.0.0.1:5000/save_shoulder_position'
    data = {'position': [left_shoulder, right_shoulder]}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(data), headers=headers)
    except Exception as e:
        print('Error:', e)    
        
def save_hand_position(left_hand, right_hand):
    url = 'http://127.0.0.1:5000/save_hand_position'
    data = {'position': [left_hand, right_hand]}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(data), headers=headers)
    except Exception as e:
        print('Error:', e) 

def save_elbo_position(left_elbo, right_elbo):
    url = 'http://127.0.0.1:5000/save_elbo_position'
    data = {'position': [left_elbo, right_elbo]}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(data), headers=headers)
    except Exception as e:
        print('Error:', e)
         
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    # Open a connection to the camera (0 corresponds to the default camera)
    cap = cv2.VideoCapture(0)

    # Load the face cascade classifier
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    while cap.isOpened():
        # Read a frame from the camera
        ret, frame = cap.read()
        # download the frame as a png file in the page images/current_frame.png
        cv2.imwrite('images/current_frame.png', frame)
        
        if not ret:
            break

        # Convert the BGR frame to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame and get the pose results
        results = pose.process(frame_rgb)

        # Perform face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        for x, y, w, h in faces:
            img = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 1)
            try:
                # Analyze face for emotion
                analyze = DeepFace.analyze(img, actions=['emotion'])
                emotion = analyze[0]['dominant_emotion']
                print(emotion)
                save_expression(emotion)

            except Exception as e:
                print('No face detected')

        # Draw the pose landmarks on the frame
        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
            left_shoulder = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            # Convert from normalized coordinates to pixel coordinates
            image_height, image_width, _ = frame.shape
            left_shoulder_x = int(left_shoulder.x * image_width)
            left_shoulder_y = int(left_shoulder.y * image_height)
            right_shoulder_x = int(right_shoulder.x * image_width)
            right_shoulder_y = int(right_shoulder.y * image_height)
            
            save_shoulder_position([left_shoulder_x, left_shoulder_y], [right_shoulder_x, right_shoulder_y])
            
        # Draw the pose landmarks on the frame
        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
            left_hand = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST]
            right_hand = results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST]
            # Convert from normalized coordinates to pixel coordinates
            image_height, image_width, _ = frame.shape
            left_hand_x = int(left_hand.x * image_width)
            left_hand_y = int(left_hand.y * image_height)
            right_hand_x = int(right_hand.x * image_width)
            right_hand_y = int(right_hand.y * image_height)
            
            save_hand_position([left_hand_x, left_hand_y], [right_hand_x, right_hand_y])
            
            
        # Draw the pose landmarks on the frame
        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
            left_elbo = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW]
            right_elbo = results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW]
            # Convert from normalized coordinates to pixel coordinates
            image_height, image_width, _ = frame.shape
            left_elbo_x = int(left_elbo.x * image_width)
            left_elbo_y = int(left_elbo.y * image_height)
            right_elbo_x = int(right_elbo.x * image_width)
            right_elbo_y = int(right_elbo.y * image_height)
            
            save_elbo_position([left_elbo_x, left_elbo_y], [right_elbo_x, right_elbo_y])
            
        # Display the frame with pose landmarks and face detection
        cv2.imshow('Real-time Detection', frame)

        # time.sleep(1)
        
        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close the OpenCV windows
    cap.release()
    cv2.destroyAllWindows()