import Home from "./components/Home";
import OBNavbar from "./components/OBNavbar";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
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
            <Route path="/productList" element={<ProductList/>}/>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </Container>
      </>
    </BrowserRouter>

  )
}
export default App
