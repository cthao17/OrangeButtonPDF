import fitz
import tempfile
import os
from google.cloud import storage

def pdf_to_images(pdf_path, resolution=300):
    pdf_document = fitz.open(pdf_path)
    
    for page_number in range(len(pdf_document)):
        page = pdf_document.load_page(page_number)
        
        pixmap = page.get_pixmap(matrix=fitz.Matrix(resolution/72, resolution/72))

        temp_image_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        temp_image_path = temp_image_file.name
        pixmap.save(temp_image_path)

        upload_blob('sample-bucket-1234532', temp_image_path, f"output_images/page_{page_number + 1}.png")
        
        os.unlink(temp_image_path)
    pdf_document.close()

def upload_blob(bucket_name, source_file_name, destination_blob_name):

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    generation_match_precondition = 0

    blob.upload_from_filename(source_file_name, if_generation_match=generation_match_precondition)

    print(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )

pdf_to_images("Series_4V3_Module_Datasheet.pdf")
