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

app = Flask(__name__)

CORS(app, resources={"/upload": {"origins": "*"}}) # https://flask-cors.readthedocs.io/en/latest/

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
            not_needed = ["AlternativeIdentifiers","Packages", "ProdCertifications", "ProdInstructions", "ProdSpecifications", "SubstituteProducts", "Warranties", "FuseSeriesRating", "IsBIPV"]
            for key in d["ProdModule"].copy():
                 # if "not_needed" or if value is empty, delete from dict
                if key in not_needed:
                    del d["ProdModule"][key]
                    continue
                if d["ProdModule"][key] == {}:
                    del d["ProdModule"][key]
                for cell_key in d["ProdModule"]["ProdCell"].copy():
                    if cell_key in not_needed: # cleanup ProdCell fields that we don't plan on displaying to the user
                        del d["ProdModule"]["ProdCell"][cell_key]
            data.append(d)
    return jsonify(data)

@app.route('/upload', methods=['POST'])
def pdf_to_images():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'})

    pdf_file = request.files['pdf']

    file_name = pdf_file.filename
    file_name = file_name.split('.')[0]

    temp_pdf_path = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False).name
    pdf_file.save(temp_pdf_path)
    
    try:
        images_paths = convert_pdf_to_images(temp_pdf_path)
        image_names = []

        bucket_name = 'sample-bucket-1234532'
        for index, image_path in enumerate(images_paths):
            print(image_path)
            upload_blob(bucket_name, image_path, f"output_images/{file_name}_page{index + 1}.png")
            image_names.append(f"{file_name}_page{index + 1}.png")

        output, successful = runGemini(image_names, True, "enhanced-ward-415819", "us-central1")

        if successful:
            delete_from_blob(bucket_name)
           
        return jsonify({'message': 'Images uploaded successfully', 'images': image_names, 'output': output, 'successful': successful})

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

def delete_from_blob(bucket_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)

    blobs = bucket.list_blobs(prefix="output_images")
    for blob in blobs:
        blob.delete()

def runGemini(image_names, successful: bool, project_id: str, location: str):
    if successful:
        # Initialize Vertex AI
        gem_responses = {}
        vertexai.init(project=project_id, location=location)
        # Load the model
        generation_config = GenerationConfig(temperature=0.3)
        multimodal_model = GenerativeModel("gemini-1.0-pro-vision", generation_config=generation_config)
        query = '''extract the various tables from the document and convert them to json. 
                    if there are no tables, extract the company name, as well as any relevant data and structure it in JSON
                    You are hallucinating some data. If 2 models are stacked on top of each other, they are the same.
                    Seperate the JSON by model.
        '''
        
        for image in image_names:
            print(image)
            url = "gs://sample-bucket-1234532/output_images/"  + image
            response = multimodal_model.generate_content(
                [
                    Part.from_uri(
                        url, mime_type="image/png"
                    ),
                    query,
                ]
            )
           
            start_index = response.text.find('{')
            end_index = response.text.rfind('}') + 1

            json_text = response.text[start_index:end_index]
            print("Response text:", response.text) 
            try:
                decoded_text = json.loads(json_text)
                gem_responses[image] = decoded_text
            except json.JSONDecodeError as e:
                print("Error decoding JSON:", e)
                gem_responses[image] = {"error": "Failed to decode JSON response"}
        
        return gem_responses, True

if __name__ == '__main__':
    app.run(debug=True)
