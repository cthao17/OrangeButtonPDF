from flask import Flask, request, jsonify
import os
import json
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

        output_file_path = os.path.join(os.path.dirname(__file__), 'sample', 'output.txt')
        with open(output_file_path, 'w') as output_file:
            for page_number, content in enumerate(pages, start=1):
                output_file.write(f"Page {page_number}:\n{content}\n\n")

    os.unlink(temp_file.name)

    return jsonify({'num_pages': len(pages), 'success': True})

if __name__ == '__main__':
    app.run(debug=True)
