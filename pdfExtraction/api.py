from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import aiplatform
import google.generativeai as genai
import fitz
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

@app.route("/upload-default", methods=["POST"])
def upload_default():
    def getJSONFilePaths():
        paths = []
        for file in os.listdir("./datasheets/train_test/Sheet1/output"):
            if file.endswith(".json"):
                paths.append(f"./datasheets/train_test/Sheet1/output/{file}")
        return paths

    filepaths = getJSONFilePaths()

    data = []
    for file in filepaths:
        with open(file, "r") as f:
            d = json.load(f)
            # removes the "Value" key from the dictionary if it is empty or -1
            for key in d["ProdModule"]:
                if type(d["ProdModule"][key]) == dict:
                    if "Value" in d["ProdModule"][key].keys() and (d["ProdModule"][key]["Value"] == "" or d["ProdModule"][key]["Value"] == -1):
                        del d["ProdModule"][key]["Value"]
            # previous step leaves us with key: {<empty dictionary>}, we want to remove those k:v pairs
            for key in d["ProdModule"].copy():
                if d["ProdModule"][key] == {}:
                    del d["ProdModule"][key]
            data.append(d)
    return jsonify(data)


@app.route('/upload', methods=['POST'])
def pdf_to_images():

    file = request.files.get("file") # https://werkzeug.palletsprojects.com/en/3.0.x/datastructures/#werkzeug.datastructures.FileStorage
    print("filename: ", file.filename)
    print("type of file obj: ", type(file))
    if 'file' not in request.files: 
        return jsonify({'error': 'No file part'}), 400
    
    pdf_file = file
    # pdf_file = request.files['pdf']
    temp_pdf_path = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False).name
    pdf_file.save(temp_pdf_path)
    print("saved temp file")

    try:
        images_paths = convert_pdf_to_images(temp_pdf_path)
        print("gemini running...")
        output = runGemini(images_paths, True)
        print("structuring output...")
        formatted = structureOutput(output, True)
        write_json_to_file(formatted, 'output.json')
        print("returning success")
        return jsonify({'message': 'Images uploaded successfully', 'output': formatted, 'successful': 'true'})
    except Exception as e:
        return jsonify({'error': str(e), 'successful': 'false'})
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
def runGemini(image_paths, successful: bool):
    if successful:
        gem_responses = {}

        generation_config = genai.GenerationConfig(temperature=0.3)
        query = '''Process the document:
                        Extract Tables:
                            Identify and extract all tables within the document.
                            Convert each table to a separate JSON object.
                            If a table cell is empty, use null in the JSON.
                        Extract Additional Data (if no tables):
                            If no tables are found, extract the company name from the document (if present).
                            Look for other relevant data points (specify desired data points if possible).
                            Structure all extracted data (company name and other relevant data) into a single JSON object following the provided structure.
                        Model Handling:
                            Assume two stacked models are equivalent but keep them structured as seperate models.
                            Provide separate JSON outputs for each model encountered (if applicable).
                        Error Handling:
                            If specific data points are missing, leave the corresponding field in the JSON object as null.
                '''
        for image_path in image_paths:
            try:
                genai.delete_file(name=image_path)
            except:
                file = genai.upload_file(path=image_path, display_name=image_path)

            multimodal_model = genai.GenerativeModel("gemini-1.5-pro-latest", generation_config=generation_config)
            response = multimodal_model.generate_content(
            [
                file,
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

def structureOutput(output, successful: bool):
    if successful:
        gem_responses = {}
        generation_config = genai.GenerationConfig(temperature=0.3)
        count = 0
        for out in output:
            prompt = f'''
            Restructure JSON based on Template:
                Given two JSON objects:

                    Input JSON: This is the output from the previous call and can be accessed through {output[out]}.
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
            print(json_text)
            try:
                decoded_text = json.loads(json_text)
                gem_responses[count] = decoded_text
            except json.JSONDecodeError as e:
                gem_responses[count] = {"error": "Failed to decode JSON response"}
            count += 1
        return gem_responses


def write_json_to_file(data, filename):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == '__main__':
    loaded_json_data = load_json_file("emptyProdMod_modified.json")
    app.run(debug=True)
