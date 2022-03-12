import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';

function MyNavbar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand href="#">Cnc Cutter</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='ml-auto'>
                        <NavDropdown title="Project" className="navbar-title">
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



                        {/* < ul className="navbar-nav" >
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <a type="button" className="nav-item dropdown-list" data-toggle="dropdown">
                                            Project </a>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#">
                                                Create Project</a>
                                            <a className="dropdown-item" href="#">
                                                Open Project</a>
                                            <a className="dropdown-item" href="#">
                                                Close Project</a>
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <a type="button" className="nav-item dropdown-list" data-toggle="dropdown">
                                            View </a>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#">
                                                Link 1</a>
                                            <a className="dropdown-item" href="#">
                                                Link 1</a>
                                            <a className="dropdown-item" href="#">
                                                Link 1</a>
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <a type="button" className="nav-item dropdown-list" data-toggle="dropdown">
                                            Extra </a>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#">
                                                Link 1</a>
                                            <a className="dropdown-item" href="#">
                                                Link 1</a>
                                            <a className="dropdown-item" href="#">
                                                Link 1</a>
                                        </div>
                                    </div>
                                </li>
                            </ul >*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >);

    /*const htmlToReactParser = new HTMLToReactParser();
    const reactElement = htmlToReactParser.parse(HTMLElements);
    return reactElement;*/
}

export default MyNavbar; 