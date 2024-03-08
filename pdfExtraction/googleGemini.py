# TODO(developer): Vertex AI SDK - uncomment below & run
# pip3 install --upgrade --user google-cloud-aiplatform
# gcloud auth application-default login

import vertexai
from vertexai.vision_models import ImageQnAModel, Image
from vertexai.generative_models import GenerativeModel, Part, GenerationConfig


def generate_text(project_id: str, location: str) -> str:
    # Initialize Vertex AI
    vertexai.init(project=project_id, location=location)
    # Load the model
    generation_config = GenerationConfig(temperature=0.1)
    multimodal_model = GenerativeModel("gemini-1.0-pro-vision", generation_config=generation_config)
    # Query the model

    response = multimodal_model.generate_content(
        [
            # Add an example image
            Part.from_uri(
                "gs://sample-bucket-1234532/Screenshot 2024-02-29 at 2.45.21 PM.png", mime_type="image/png"
            ),
            # Add an example query
            "extract the various tables from the document and convert them to json",
        ]
        
    )
    print(response)
    return response.text

print(generate_text("enhanced-ward-415819", "us-central1"))

