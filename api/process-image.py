from http.server import BaseHTTPRequestHandler, HTTPServer
import base64
import os
from PIL import Image
from io import BytesIO
import json
import cv2
import numpy as np
import pathlib
import textwrap
import google.generativeai as genai

GOOGLE_API_KEY = None
generation_config = None
model = None


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-type", "application/json")
        self.end_headers()

        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        image = data.get("image")
        number = data.get("number")
        color = data.get("color")

        if not image or not number or not color:
            self.send_response(400)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(
                json.dumps({"error": "Missing required fields"}).encode("utf-8")
            )
            return

        try:
            # Decode the base64 image
            image_data = base64.b64decode(image.split(",")[1])
            img = Image.open(BytesIO(image_data))

            files = [
                upload_to_gemini("", mime_type="image/jpeg"),
            ]

            chat_session = model.start_chat(
                history=[
                    {
                        "role": "user",
                        "parts": [
                            files[0],
                        ],
                    },
                    {
                        "role": "model",
                        "parts": [
                            '```json\n[\n    {"number": 7, "color": "orange"},\n    {"number": 7, "color": "black"},\n    {"number": 7, "color": "blue"},\n    {"number": 10, "color": "black"},\n    {"number": 11, "color": "black"},\n    {"number": 12, "color": "black"},\n    {"number": 2, "color": "orange"},\n    {"number": 3, "color": "orange"},\n    {"number": 4, "color": "orange"},\n    {"number": 5, "color": "orange"},\n    {"number": 5, "color": "red"},\n    {"number": 6, "color": "red"},\n    {"number": 7, "color": "red"},\n    {"number": 8, "color": "red"}\n]\n```',
                        ],
                    },
                ]
            )

            response = chat_session.send_message("INSERT_INPUT_HERE")

            print(response.text)

            self.wfile.write(json.dumps().encode("utf-8"))
        except Exception as e:
            print("Error processing the image:", e)
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(
                json.dumps({"error": "Internal server error"}).encode("utf-8")
            )


def run(server_class=HTTPServer, handler_class=handler, port=8000):
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()


def init():
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    # Create the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro-002",
        generation_config=generation_config,
        system_instruction="Take the given image of a rack for the popular Turkish game 'okey', detect and identifiy each and every one of the pieces. Identify each piece by its number and color. If the piece has a symbol instead of number pass 'fake_okey' as a value for color. If the piece has nothing on it it is \n a joker. Pass 999 as a number. Give your answer in json format. Keep in mind that colors can only be {red, black, blue, yellow} and numbers are between 1-13",
    )


def upload_to_gemini(path, mime_type=None):
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Uploaded file '{file.display_name}' as: {file.uri}")
    return file


if __name__ == "__main__":
    run()
