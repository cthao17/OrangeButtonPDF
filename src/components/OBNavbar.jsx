import { Navbar, Container, NavDropdown, Nav, Row } from "react-bootstrap";
import "./styles.css"
import { Link } from "react-router-dom";
function OBNavbar(props) {
    // logo png (should eventually host our images locally): 
    // https://www.myorangebutton.com/wp-content/uploads/2023/05/cropped-Orange-button-logo-512.png
    
    // Reloads ot home page when clicking on OB Icon

    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                        <img id = "logo" src="https://www.myorangebutton.com/wp-content/uploads/2023/05/cropped-Orange-button-logo-512.png" alt="ob logo" />
                    </Navbar.Brand>
                <Navbar.Text id="navbar-text">
                    PDF Uploader
                </Navbar.Text>
                    <Navbar.Toggle aria-controls="navbar-items"/>
                    <Navbar.Collapse id = "navbar-items">
                        <Nav className = "me-auto">
                            <Nav.Link href = "https://productregistry.myorangebutton.com/product/" id = "link" target="_blank">
                                Product Registry
                                </Nav.Link>
                            <Nav.Link href = "https://openobeditor.sunspec.org/#/" id="link" target="_blank">
                                Open OB Editor
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
            </Container>
        </Navbar>
        
    )
}

export default OBNavbar;