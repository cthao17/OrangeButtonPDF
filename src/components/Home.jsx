import axios from "axios";
import "./styles.css";
import { useState, useRef } from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import {useNavigate} from 'react-router-dom'

function Home(props) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInvalid, setShowInvalid] = useState(false);
    const [showDuplicate, setShowDuplicate] = useState(false);
    const navigate = useNavigate();

    // https://www.npmjs.com/package/react-pdf
    // find way to handle/view pdfs in react (look for good packages: well maintained with not too many dependencies)
    const [fileState, setFileState] = useState( {
        selectedFile: null,
        numPages: null,
        pageNumber: 1
    })

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

    const [files, setFiles] = useState([])
    const inputRef = useRef()
    const handleClick = () => {
        inputRef.current.click()
    }

    const handleFiles = (fileList, mode = 'w') => {
        if (fileList.length === 0) {
            return;
        }
    
        Array.from(fileList).forEach(file => {
            if (!file.name.toUpperCase().endsWith(".PDF")) {
                setShowInvalid(true);
                return;
            }
    
            if (files.some(existingFile => existingFile.name === file.name)) {
                setShowDuplicate(true);
                return;
            }
    
            setShowSuccess(true);
            if (mode === 'a') {
                // Add file to the existing files list if mode is 'a'
                setFiles(prevFiles => [...prevFiles, file]);
            } else {
                // Replace files list with new files if mode is 'w'
                setFiles([file]);
            }
        });
    }

    const removeFile = (name) => {
        const newFiles = files.filter((file) => file.name !== name)
        setFiles(newFiles)
    }

    const preventBubbling = (e) => {
        e.stopPropagation()
        e.preventDefault()
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
            <Toast onClose={() => setShowDuplicate(false)} show={showDuplicate} delay={3000} bg="warning" animation autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">Duplicate file detected!</Toast.Body>
                </Toast>
        </ToastContainer>
        <div id = "wrapper">
            <div id="list">
                <h5>Files Uploaded:</h5>
                    {files && (
                        <ul id="files">
                            {files.map((file, i) => (
                                <li key={file.name}>
                                    {i + 1}. {file.name}
                                    <span>
                                        <button id="removeButton" onClick={() => removeFile(file.name)}>Remove</button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
            <div
                id="form"
                onDragEnter={preventBubbling}
                onDragOver={preventBubbling}
                onDrop={(e) => {
                    preventBubbling(e);
                    handleFiles(e.dataTransfer.files, 'a');
                }}>
                <i id="fa fa-cloud-upload fa-4x"></i>
                <p>Drag and drop files or select files below</p>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => handleFiles(e.target.files, 'a')}
                />
                <button onClick={handleClick}>Choose Files</button>
            </div>

            <button id="submit" onClick={handleSubmit}>
                Submit
            </button>
        </div>
        
       
        

    </>);
}
export default Home;