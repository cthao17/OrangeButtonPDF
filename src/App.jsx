import Home from "./components/Home";
import OBNavbar from "./components/OBNavbar";
import {Container} from "react-bootstrap";

function App() {

  return (
    <>
      <OBNavbar/>
      <Container>
        <Home/>
      </Container>
    </>
  )
}
export default App
