import PDFView from "./PDFView";
import { Modal, Row, Col } from "react-bootstrap";

function PreviewModal(props){
    
    const handleClose = () => {
        props.onHide();
    }
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
                        <PDFView pdfdata={props.pdfdata}/>
                    </Modal.Body>
                </Modal>
            </Col>
            
        </Row>
    )
}
export default PreviewModal;