# Documentation for PDF Processing Flask Web Application And Running Gemini
## This Python web application uses Flask to handle PDF files, extract their text content, and restructure the output based on a template JSON. It leverages various libraries including PyPDFLoader for reading PDFs, Flask for the web server, and Google Cloud's AI and machine learning services.

### Install dependencies 
We recommend that you setup the API within a `python venv` to ensure you only have the modules needed and there are not circular imports.

Along with that, use a python version between 3.10.3 - 3.11 to ensure the modules work as expected.

Currently, the requirements.txt only works for MacOS 
- [requirements.txt](https://github.com/cthao17/OrangeButtonPDF/blob/main/pdfExtraction/requirements.txt)
- [requirements_windows.txt] In progress


To install these dependencies, use `pip install -r requirements.txt`

Along with those dependencies, you will need to set up a GCP with Vertex AI service turned on.


Following that, you must authenticate your platform for gcloud CLI. [gcloud CLI steps](https://cloud.google.com/docs/authentication/gcloud)

### Enviroment Configuration
Create a .env file in the same directory as the api. The .env should include GOOGLE_API_KEY, GOOGLE_LOCATION_ID, and GOOGLE_PROJECT_ID.

### Endpoint: /upload
- **Input**: Multipart form-data containing a PDF file.
- **Output**: A JSON response with the processed data or an error message.

### Workflow:

- **File Handling**: The uploaded PDF file is saved to a temporary location.
- **PDF Processing**: pdf_to_text function extracts text from each page of the PDF using PyPDFLoader.
- **Data Structuring**: structureOutput function restructures the extracted text based on a predefined template JSON loaded at application startup.
- **Error Handling**: Proper error responses are generated if any part of the process fails.
- **Cleanu**p: Temporary files are deleted after processing.

### Running the application

The application can be started by running the module directly, which will also load the JSON template data and run the Flask app in debug mode.



