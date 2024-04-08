import {Document, Page, pdfjs } from 'react-pdf';
// import {Document, Page} from '@react-pdf/renderer';
import { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// https://github.com/wojtekmaj/react-pdf#support-for-text-layer
// https://codesandbox.io/p/sandbox/pdf-sign-il1ngr?file=%2Fsrc%2FApp.js%3A157%2C59
function PDFView({pdfdata}) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    return (
        <div id = "display-pdf" style={{width: "100%", height: "70vh", overflow: "scroll"}}>
                <Document file={pdfdata} 
                    onLoadSuccess={(data) => {
                        setNumPages(data.numPages);
                        }}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    )
}
export default PDFView;