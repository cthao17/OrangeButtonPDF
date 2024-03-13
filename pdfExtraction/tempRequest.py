import os
import requests

relative_path = 'datasheets/Series 7 TR1 High Bin Datasheet.pdf'
file_path = os.path.join(os.getcwd(), relative_path)

url = "http://127.0.0.1:5000/upload"

with open(file_path, 'rb') as file:
    files = {'file': ('Series 7 TR1 High Bin Datasheet.pdf', file)}
    response = requests.post(url, files=files)

print(response.json())