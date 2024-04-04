import {Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';

function PDFView({pdfData}) {
    const [pdf, setPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }
    return (
        <div id = "display-pdf" style={{maxWidth: "100%"}}>
            <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    )
}
export default PDFView;