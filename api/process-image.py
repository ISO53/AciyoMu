from http.server import BaseHTTPRequestHandler
# import base64
# import cv2
import numpy as np
# from PIL import Image
# from io import BytesIO
# from flask import Flask, request, jsonify
 
class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Hello, world!'.encode('utf-8'))
        return