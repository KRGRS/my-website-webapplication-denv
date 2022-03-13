import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';

function MyNavbar() {
    return (
        <Navbar bg="dark" variant="dark" className="py-4">
            <Container fluid>
                <Navbar.Brand href="#">Cnc Cutter</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='ml-auto'>
                        <NavDropdown title="Project">
                            <NavDropdown.Item href="#" className="navbar-title">Create Project</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="navbar-title">Open Project</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="navbar-title">Close Project</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="View">
                            <NavDropdown.Item href="#" className="navbar-title">Link1</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="navbar-title">Link1</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="navbar-title">Link1</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Extra">
                            <NavDropdown.Item href="#" className="navbar-title">Link1</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="navbar-title">Link1</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="navbar-title">Link1</NavDropdown.Item>
                        </NavDropdown>
                        <Nav className="ml-right">
                            <Nav.Link className="justify-content-end" href="#">User</Nav.Link>
                        </Nav>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >);
}

export default MyNavbar; 