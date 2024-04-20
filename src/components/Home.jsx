import axios from "axios";
import "./styles.css";
import { useState, useRef } from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import {useNavigate} from 'react-router-dom'
import PreviewModal from "./PreviewModal";
function Home(props) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInvalid, setShowInvalid] = useState(false);
    const [showDuplicate, setShowDuplicate] = useState(false);
    const [pdfdata, setpdfdata] = useState(null);
    // for popup preview modal
    const [modalVisible, setModalVisible] = useState(false);
    const handleClose = () => setModalVisible(false);
    const handleShow = () => setModalVisible(true);
    // response data from api
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isAxiosError, setIsAxiosError] = useState(false);

    // https://www.npmjs.com/package/react-pdf
    // find way to handle/view pdfs in react (look for good packages: well maintained with not too many dependencies)

    // https://stackoverflow.com/questions/53132236/file-upload-with-reactjs-and-flask
    // https://stackoverflow.com/questions/60544939/cors-issues-for-flask-api-call-from-react-both-in-localhost 
    const uploadFile = () => {
        // let file = fileState.selectedFile;
        let file = files[0]
        console.log(typeof(file));
        console.log(file)
        const formData = new FormData();
        formData.append("file", file);
        axios.defaults.timeout = 180000;
        console.log("posting" + formData)
        axios.post("http://127.0.0.1:5000/upload", formData) 
            .then(res => () => {
                console.log("inside .then block");
                if (res.status !== 200){
                    console.error("Error uploading file");
                }else{
                    console.log(res.data)
                    setData(res.data);
                    console.log(res);
                    navigate('/productList'); // navigate after response is received
                }
            })
            .catch(err => console.error(err));
        console.log("after post")
    }
    const uploadFile2 = async() => {
        let file = files[0]
        console.log(typeof(file));
        console.log(file)
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData
            });
            console.log("inside try block");
            if (!response.ok){
                console.error("Error uploading file");
                setIsLoading(false);
                setIsAxiosError(true);
            }else{
                const data = await response.json();
                console.log(data);
                console.log(data.output);
                if(data.successful == "true"){
                    navigate('/productList'); // navigate after response is received
                } else {
                    setIsLoading(false);
                    setIsAxiosError(true);
                }
            }
        }catch(err){
            console.error(err);                
            setIsLoading(false);
            setIsAxiosError(true);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(e.target.files[0]);
        console.log(files);

        setIsLoading(true);
        // parse form, get results
        // redirect to results
        uploadFile2();
        // TODO wait while getting response
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

    const onFileLoad = (e) => {
        const file = e.target.files[0];
        setpdfdata(file);
    }

    return (<>
        <ToastContainer position="top-end">
            <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} bg = "success" animation={true} autohide>
            <Toast.Header>
                <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className="text-white">File selected!</Toast.Body>
            </Toast>
            <Toast onClose={() => setShowInvalid (false)} show={showInvalid} delay={3000} bg = "danger" animation={true} autohide>
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
            <Toast onClose={() => setIsLoading(false)} show={isLoading} delay={0} bg="info" animation={false}>
                <Toast.Header>
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body className="text-white">
                    <div className="loading-circle"></div>
                    Loading...
                </Toast.Body>
            </Toast>
            <Toast onClose={() => setIsAxiosError(false)} show={isAxiosError} delay={6000} bg="danger" animation autohide>
                <Toast.Header>
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body className="text-white">Error with converting file. Please try again or new file</Toast.Body>
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
            
            <div id="form"
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
                    onChange={(e) => {
                        handleFiles(e.target.files, 'a');
                        onFileLoad(e);
                    }}
                />
                <button onClick={handleClick}>Choose Files</button>
            </div>
            <div id="upload-bottom">
                <button id="previewbtn"
                    onClick={(event) => {
                        event.preventDefault();
                        handleShow(true);
                    }}
                    disabled={files.length === 0}
                    >
                    Preview
                </button>
                <PreviewModal 
                    show = {modalVisible}
                    onHide={handleClose}
                    pdfdata={pdfdata}
                />
                <button id="submit" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            
            
        </div>
        
       
        

    </>);
}
export default Home;