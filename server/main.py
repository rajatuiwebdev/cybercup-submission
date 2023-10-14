from flask import Flask, request, send_file, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import os
import zipfile
from PIL import Image
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)
api = Api(app)

UPLOAD_FOLDER = 'uploads'
COMPRESSED_FOLDER = 'compressed'
DECOMPRESSED_FOLDER = 'decompressed'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','py'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['COMPRESSED_FOLDER'] = COMPRESSED_FOLDER
app.config['DECOMPRESSED_FOLDER'] = DECOMPRESSED_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
def decompress_text_binary(compressed_file_path):
    extract_dir = os.path.join(app.config['DECOMPRESSED_FOLDER'], f'decompressed_{os.path.basename(compressed_file_path)}')
    
    with zipfile.ZipFile(compressed_file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    
    return extract_dir
def compress_text_binary(file_path):
    compressed_path = os.path.join(app.config['COMPRESSED_FOLDER'], f'compressed_{os.path.basename(file_path)}.zip')
    with zipfile.ZipFile(compressed_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        zipf.write(file_path, os.path.basename(file_path))
    return compressed_path
def decompress_image(image_path):
    decompressed_path = os.path.join(app.config['DECOMPRESSED_FOLDER'], f'decompressed_{os.path.basename(image_path)}')
    with Image.open(image_path) as img:
        img.save(decompressed_path, quality=100)
    return decompressed_path
def compress_image(image_path):
    compressed_path = os.path.join(app.config['COMPRESSED_FOLDER'], f'compressed_{os.path.basename(image_path)}')
    with Image.open(image_path) as img:
        img.save(compressed_path, quality=50)
    return compressed_path

class FileCompression(Resource):
    def post(self):
        if 'file' not in request.files:
            return {'error': 'No file part'}, 400

        file = request.files['file']
        if file.filename == '':
            return {'error': 'No selected file'}, 400

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        print(f'Saving file to: {file_path}')
        file.save(file_path)

        if allowed_file(file.filename):
            if file.filename.lower().endswith(('png', 'jpg', 'jpeg', 'gif')):
                print("Image")
                compressed_path = compress_image(file_path)
            else:
                print("Binary")
                compressed_path = compress_text_binary(file_path)

            os.remove(file_path)  # Remove the original file

            if compressed_path:
                return send_file(compressed_path, as_attachment=True)
            else:
                return {'error': 'Failed to compress file'}, 500

        return {'error': 'Invalid file format'}, 400

class FileDeCompression(Resource):
    def post(self):
        if 'ipfsHash' not in request.form:
            return {'error': 'IPFS hash not provided'}, 400

        ipfs_hash = request.form['ipfsHash']
        pinata_url = f'https://gateway.pinata.cloud/ipfs/{ipfs_hash}'

        response = requests.get(pinata_url)
        if response.status_code != 200:
            return {'error': 'Failed to fetch file from Pinata'}, response.status_code

        # Save the downloaded content to a local file
        downloaded_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f'downloaded_{ipfs_hash}')
        with open(downloaded_file_path, 'wb') as file:
            file.write(response.content)

        # Implement your decompression logic based on the content type
        content_type = response.headers.get('Content-Type', '').lower()
        if 'image' in content_type:
            print("Decompressing Image")
            decompressed_path = decompress_image(downloaded_file_path)
        else:
            print("Decompressing Binary/Text")
            decompressed_path = decompress_text_binary(downloaded_file_path)

        # Return the decompressed file to the client for download
        return send_file(decompressed_path, as_attachment=True)

api.add_resource(FileDeCompression, '/decompress')
api.add_resource(FileCompression, '/compress')
if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['COMPRESSED_FOLDER'], exist_ok=True)

    app.run(debug=True)
