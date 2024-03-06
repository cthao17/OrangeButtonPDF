import axios from "axios";
import "./styles.css";
import { useState } from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import {useNavigate} from 'react-router-dom'

function Home(props) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInvalid, setShowInvalid] = useState(false);
    const navigate = useNavigate();
    // https://www.npmjs.com/package/react-pdf
    // find way to handle/view pdfs in react (look for good packages: well maintained with not too many dependencies)
    const [fileState, setFileState] = useState( {
        selectedFile: null,
        numPages: null,
        pageNumber: 1
    })
    const fileSelected = (e) => {
        console.log(e);
        if (e.target.files.length === 0) {
            // do nothing (deselect case)
        }else{
            console.log(e.target.value);
            if (e.target.value.toUpperCase().endsWith(".PDF")) {
                setShowSuccess(true);
                setFileState( {selectedFile : e.target.files[0]});
            }else{
                setShowInvalid(true);
            }
        }
    }
    // https://stackoverflow.com/questions/53132236/file-upload-with-reactjs-and-flask
    // https://stackoverflow.com/questions/60544939/cors-issues-for-flask-api-call-from-react-both-in-localhost 
    const uploadFile = () => {
        let file = fileState.selectedFile;
        const formData = new FormData();
        formData.append("file", file);
        axios.post("http://127.0.0.1:5000/upload", formData) 
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // parse form, get results
        // redirect to results
        uploadFile();
        navigate('/results');
    }

    console.log(fileState.selectedFile);
    return (<>
        <ToastContainer position="top-end">
            <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} bg = "success" animation={true} autohide>
            <Toast.Header>
                <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className="text-white">File selected!</Toast.Body>
            </Toast>
            <Toast onClose={() => setShowInvalid(false)} show={showInvalid} delay={3000} bg = "danger" animation={true} autohide>
            <Toast.Header>
                <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className="text-white">Invalid file type! Select a pdf.</Toast.Body>
            </Toast>
        </ToastContainer>
        <div id = "wrapper">
            <div id="home-content-container">
                <h2 id="home-header">Upload a PDF file to get started</h2>
                <form onSubmit={handleSubmit}>
                    <div id = "upload-form">
                        <div id = "upload-input-container">
                            <label htmlFor="file" id="upload-label">
                                Choose file to upload (PDF)
                            </label>
                            <input type="file" accept="pdf" id = "file" onChange={(e)=> fileSelected(e)}/>
                        </div>
                        
                        <button type = "submit" id="submit-btn" disabled={fileState.selectedFile === null}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
        
       
        

    </>);
}
export default Home;