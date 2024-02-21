import "./styles.css";
import { useState } from "react";

function Home(props) {
    // some sort of text to prompt user
    // box for uploading files
    // submit button to "upload" files
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
            alert("file selected!");
            console.log(e.target.value);
            setFileState( {selectedFile : e.target.files[0]});
        }
        
        
    }
    console.log(fileState.selectedFile);
    return (<>
        <div id = "wrapper">
            <div id="home-content-container">
                <h2 id="home-header">Upload a PDF file to get started</h2>
                <form>
                    <div id = "upload-form">
                        <div id = "upload-input-container">
                            <label htmlFor="file" id="upload-label">
                                Choose file to upload (PDF)
                            </label>
                            <input type="file" accept="pdf" id = "file" onChange={(e)=> fileSelected(e)}/>
                        </div>
                        
                        <button id="submit-btn">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        
       
        

    </>);
}
export default Home;