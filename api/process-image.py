from http.server import BaseHTTPRequestHandler, HTTPServer
import base64
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
import json

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        image = data.get('image')
        number = data.get('number')
        color = data.get('color')

        if not image or not number or not color:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Missing required fields'}).encode('utf-8'))
            return

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

            response = {
                'processedImage': processed_image,
                'number': number,
                'color': color,
            }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        except Exception as e:
            print('Error processing the image:', e)
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Internal server error'}).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=handler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()