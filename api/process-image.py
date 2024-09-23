import base64
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/process-image', methods=['POST'])
def process_image():
    if request.method != 'POST':
        return jsonify({'error': 'Method not allowed'}), 405

    data = request.get_json()
    image = data.get('image')
    number = data.get('number')
    color = data.get('color')

    if not image or not number or not color:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Decode the base64 image
        image_data = base64.b64decode(image.split(',')[1])
        img = Image.open(BytesIO(image_data))
        img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

        # Convert the image to grayscale
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Encode the processed image to base64
        _, buffer = cv2.imencode('.png', gray_img)
        processed_image = base64.b64encode(buffer).decode('utf-8')
        processed_image = f'data:image/png;base64,{processed_image}'

        return jsonify({
            'processedImage': processed_image,
            'number': number,
            'color': color,
        }), 200
    except Exception as e:
        print('Error processing the image:', e)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run()