# Orange Button PDF Datasheet Converter

## Frontend

__Installs__:
Node.js 18+ or 20+: <https://nodejs.org/en/download/current>

### Running the frontend locally
1) Clone the repo to your machine: `git clone https://github.com/cthao17/OrangeButtonPDF.git`
2) Run `npm install` inside the frontend directory (directory with node_modules, public, src, etc) to install dependencies
3) Run `npm run dev` to run the frontend locally

Non-functional
- Windows compatability with requirements.txt for flask backend
- Some data fields may not be filled out because of the prompt

Next Steps
- Prompt tuning for better accuracy in data points
- Investigation into methods to increase processing speed and accuracy
    - view different models (Mistral - purposed for this exact task)
- user friendly UI design
    - improve navigation
    - Multiple module display

## Backend

Please see the backend documentation [here](https://github.com/cthao17/OrangeButtonPDF/blob/main/API_DOCUMENTATION.md).
