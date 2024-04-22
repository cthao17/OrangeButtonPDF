from langchain_community.document_loaders import PyPDFLoader
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import aiplatform
import google.generativeai as genai
import tempfile
import os
import json
from dotenv import load_dotenv

app = Flask(__name__)

loaded_json_data = None

load_dotenv()
api_key = os.environ["GOOGLE_API_KEY"]
location = os.environ['GOOGLE_LOCATION_ID']
project = os.environ['GOOGLE_PROJECT_ID']

aiplatform.init(project=project, location=location)
genai.configure(api_key=api_key)

CORS(app, resources={"/upload": {"origins": "*"}})

@app.route('/upload', methods=['POST'])
def pdf_to_images():

    file = request.files.get("file") # https://werkzeug.palletsprojects.com/en/3.0.x/datastructures/#werkzeug.datastructures.FileStorage
    if 'file' not in request.files: 
        return jsonify({'error': 'No file part'}), 400
    
    pdf_file = file
    # pdf_file = request.files['pdf']
    temp_pdf_path = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False).name
    pdf_file.save(temp_pdf_path)

    try:
        #images_paths = convert_pdf_to_images(temp_pdf_path)
        output = pdf_to_text(temp_pdf_path)
        #output = runGemini(images_paths, True)
        formatted = structureOutput(output, True)
        print(formatted)
        write_json_to_file(formatted, 'new_output.json')
        return jsonify({'message': 'Images uploaded successfully', 'output': formatted, 'successful': 'true'})
    except Exception as e:
        return jsonify({'error': str(e), 'successful': 'false'})
    finally:
        os.unlink(temp_pdf_path)


def load_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)
    
    
def pdf_to_text(pdf_path):
    loader = PyPDFLoader(pdf_path)
    pages = loader.load_and_split()
    
    return pages

def structureOutput(output, successful: bool):
    if successful:
        gem_responses = {}
        generation_config = genai.GenerationConfig(temperature=0.3)
        count = 0
        combined = ""
        for out in output:
            combined += out.page_content
        prompt = f'''
            Restructure JSON based on Template:
                Given two JSON objects:

                    Input JSON: This is the output from the previous call and can be accessed through {combined}.
                    Template JSON: This defines the desired structure for the output ({loaded_json_data}).
                
                Your task is to transform the input JSON to match the structure of the template JSON as closely as possible.
                    For each model in the output JSON, structure it as its own model in the template JSON.
                    Use double quotes for all strings in the output JSON.
                Map corresponding values from the input JSON to the keys in the template JSON.
                If a key from the template JSON is missing in the input JSON, use the value -1 as a placeholder.
            '''
        multimodal_model = genai.GenerativeModel("gemini-1.5-pro-latest", generation_config=generation_config)
        response = multimodal_model.generate_content(prompt)

        start_index = response.text.find('{')
        end_index = response.text.rfind('}') + 1
        json_text = response.text[start_index:end_index]
        try:
            decoded_text = json.loads(json_text)
            gem_responses[count] = decoded_text
        except json.JSONDecodeError as e:
            gem_responses[count] = {"error": "Failed to decode JSON response"}
        return gem_responses


def write_json_to_file(data, filename):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == '__main__':
    loaded_json_data = load_json_file("emptyProdMod_modified.json")
    app.run(debug=True)