from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage
from flask_cors import CORS, cross_origin
import fitz
import tempfile
import os
import vertexai
import json
from vertexai.generative_models import GenerativeModel, Part, GenerationConfig

loaded_json_data = None

app = Flask(__name__)

CORS(app, resources={"/upload": {"origins": "*"}}) # https://flask-cors.readthedocs.io/en/latest/

@app.route('/upload', methods=['POST'])
def pdf_to_images():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'})

    pdf_file = request.files['pdf']
    temp_pdf_path = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False).name
    pdf_file.save(temp_pdf_path)

    try:
        images_paths = convert_pdf_to_images(temp_pdf_path)
        output = runGemini(images_paths, True, "enhanced-ward-415819", "us-central1")

        formatted = structureOutput(output, True, "enhanced-ward-415819", "us-central1")
        return jsonify({'message': 'Images uploaded successfully', 'output': formatted, 'successful': 'true'})
    finally:
        os.unlink(temp_pdf_path)


def load_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

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

def runGemini(image_paths, successful: bool, project_id: str, location: str):
    if successful:
        gem_responses = {}
        vertexai.init(project=project_id, location=location)
        generation_config = GenerationConfig(temperature=0.3)
        multimodal_model = GenerativeModel("gemini-1.0-pro-vision", generation_config=generation_config)
        query = '''extract the various tables from the document and convert them to json.
                    if there are no tables, extract the company name, as well as any relevant data and structure it in JSON
                    You are hallucinating some data. If 2 models are stacked on top of each other, they are the same.
                    Seperate the JSON by model. Make the json look like this. If you are missing data, just leave it blank. '''
        for image_path in image_paths:
            with open(image_path, 'rb') as image_file:
                image_data = image_file.read()
            response = multimodal_model.generate_content(
                [
                    Part.from_data(image_data, mime_type="image/png"),
                    query,
                ]
            )
            start_index = response.text.find('{')
            end_index = response.text.rfind('}') + 1
            json_text = response.text[start_index:end_index]
            try:
                decoded_text = json.loads(json_text)
                gem_responses[os.path.basename(image_path)] = decoded_text
            except json.JSONDecodeError as e:
                gem_responses[os.path.basename(image_path)] = {"error": "Failed to decode JSON response"}
        return gem_responses

def structureOutput(output, successful: bool, project_id: str, location: str):
    if successful:
        gem_responses = {}
        vertexai.init(project=project_id, location=location)
        generation_config = GenerationConfig(temperature=0.3)
        multimodal_model = GenerativeModel("gemini-1.0-pro-vision", generation_config=generation_config)
        count = 0
        for out in output:
            prompt = f'''
            Given this JSON, {output[out]}, structure it as closely to this as possible: {loaded_json_data} and return the structured JSON.
            Use double quotes for the strings. Make the connection between the values in the orginal json and what it is supposed to correspond to
            in the formatted JSON. If there is no corresponding value, leave it blank.
            '''
            response = multimodal_model.generate_content(prompt)
            print(response.text)
            start_index = response.text.find('{')
            end_index = response.text.rfind('}') + 1
            json_text = response.text[start_index:end_index]
            try:
                decoded_text = json.loads(json_text)
                gem_responses[count] = decoded_text
            except json.JSONDecodeError as e:
                gem_responses[count] = {"error": "Failed to decode JSON response"}
            count += 1
        return gem_responses

if __name__ == '__main__':
    loaded_json_data = load_json_file("./datasheets/train_test/emptyProdMod_modified.json")
    app.run(debug=True)
