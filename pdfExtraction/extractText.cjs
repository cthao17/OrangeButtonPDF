const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {}; 

pdfExtract.extract('./pdfExtraction/sample/Series 4V3 Module Datasheet.pdf', options, (err, data) => {
  if (err) return console.log(err);
  for (let i = 0; i < data.pages.length; i++) {
    for (let j = 0; j < data.pages[i].content.length; j++) {
        console.log(data.pages[i].content[j].str);
    }
  }
  
});