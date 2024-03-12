from flask import Flask, request, jsonify
from google.cloud import storage
import fitz
import tempfile
import os

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def pdf_to_images():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'})

    pdf_file = request.files['pdf']

    temp_pdf_path = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False).name
    pdf_file.save(temp_pdf_path)

    try:
        images_paths = convert_pdf_to_images(temp_pdf_path)
        image_names = []

        bucket_name = 'sample-bucket-1234532'
        for index, image_path in enumerate(images_paths):
            print(image_path)
            upload_blob(bucket_name, image_path, f"output_images/page_{index + 1}.png")
            image_names.append(f"page_{index + 1}.png")

        return jsonify({'message': 'Images uploaded successfully', 'images': image_names})

    finally:
        os.unlink(temp_pdf_path)

def convert_pdf_to_images(pdf_path, resolution=300):
    pdf_document = fitz.open(pdf_path)
    images_paths = []

    for page_number in range(len(pdf_document)):
        page = pdf_document.load_page(page_number)
        pixmap = page.get_pixmap(matrix=fitz.Matrix(resolution/72, resolution/72))

        temp_image_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        temp_image_path = temp_image_file.name
        pixmap.save(temp_image_path)
        images_paths.append(temp_image_path)

    pdf_document.close()

    return images_paths

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    generation_match_precondition = 0

    blob.upload_from_filename(source_file_name, if_generation_match=generation_match_precondition)

    print(f"File {source_file_name} uploaded to {destination_blob_name}.")

if __name__ == '__main__':
    app.run(debug=True)
