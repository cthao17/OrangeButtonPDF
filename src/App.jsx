import Home from "./components/Home";
import OBNavbar from "./components/OBNavbar";
import Results from "./components/Results";
import {Container} from "react-bootstrap";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <>
        <OBNavbar/>
        <Container>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/results" element={<Results/>} />
          </Routes>
        </Container>
      </>
    </BrowserRouter>

  )
}
export default App
