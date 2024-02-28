from flask import Flask, request, jsonify
import os
from tempfile import NamedTemporaryFile
from langchain_community.document_loaders import PyPDFLoader

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    with NamedTemporaryFile(delete=False) as temp_file:
        file.save(temp_file.name)
        loader = PyPDFLoader(temp_file.name)
        pages = loader.load_and_split()
        print(pages)

    os.unlink(temp_file.name)

    return jsonify({'num_pages': len(pages), 'success': True})

if __name__ == '__main__':
    app.run(debug=True)
