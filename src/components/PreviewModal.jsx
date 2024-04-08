import { Modal, Row, Col } from "react-bootstrap";
import {Document, Page, pdfjs } from 'react-pdf';
// import {Document, Page} from '@react-pdf/renderer';
import { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

function PreviewModal(props){
        
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleClose = () => {
        setPageNumber(1);
        props.onHide();
    }
    const nextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        
        }
    }
    const prevPage = () => { 
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }
    const styles = {
        footer: {
            display: "flex",
            direction: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px"
        },
        footerWrapper: {
            display: "flex",
            direction: "row",
            justifyContent: "center",
            alignItems: "center"
        
        },
        btn: {
            backgroundColor: "transparent",
            border: "none",
            color: "black",
            fontSize: "20px",
            cursor: "pointer"
        
        }
    }

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    return (
        <Row>
            <Col xs={12}>
                <Modal
                    {...props}
                    size="lg"
                    centered
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div id = "display-pdf" style={{width: "100%", height: "70vh", overflow: "scroll"}}>
                            <Document file={props.pdfdata} 
                                onLoadSuccess={(data) => {
                                    setNumPages(data.numPages);
                                    }}
                            >
                                <Page pageNumber={pageNumber} />
                            </Document>
                    
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={styles.footerWrapper}>
                        <div style={styles.footer}>
                            <button style = {styles.btn} onClick={prevPage} disabled={pageNumber === 1}>
                                <span>&#60;</span>
                            </button>
                            <p style= {{margin : 0}}>
                                Page {pageNumber} of {numPages}
                            </p>
                            <button style = {styles.btn} onClick={nextPage} disabled={pageNumber === numPages || numPages === null}>
                                <span>&#62;</span>
                            </button>
                        </div>
                        
                    </Modal.Footer>
                </Modal>
            </Col>
            
        </Row>
    )
}
export default PreviewModal;