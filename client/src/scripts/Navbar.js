import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, NavDropdown, Nav, Container} from 'react-bootstrap';

function MyNavbar(){
        return (
            <Navbar bg="light" className="navbar navbar-expand-sm navbar-light">
                <Container>
                    <Navbar.Collapse>
                        <Nav>
                            <NavDropdown title="Project" className="dropdown">
                                <NavDropdown.Item href="#" className="dropdown-list">Create Project</NavDropdown.Item>
                                <NavDropdown.Item href="#" className="dropdown-list">Open Project</NavDropdown.Item>
                                <NavDropdown.Item href="#" className="dropdown-list">Close Project</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="View">
                                <NavDropdown.Item href="#" className="dropdown-list">Link1</NavDropdown.Item>
                                <NavDropdown.Item href="#" className="dropdown-list">Link1</NavDropdown.Item>
                                <NavDropdown.Item href="#" className="dropdown-list">Link1</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Extra">
                            <NavDropdown.Item href="#" className="dropdown-list">Link1</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="dropdown-list">Link1</NavDropdown.Item>
                            <NavDropdown.Item href="#" className="dropdown-list">Link1</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link className="justify-content-end" href="#">User</Nav.Link>

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