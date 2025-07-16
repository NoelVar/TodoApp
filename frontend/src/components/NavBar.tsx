import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { User } from "../models/user";
import styles from '../styles/NavBar.module.css';
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onLogInClicked: () => void,
    onLogoutSuccessful: () => void,
}

const NavBar = ({ loggedInUser, onSignUpClicked, onLogInClicked, onLogoutSuccessful }: NavBarProps) => {
    return (
        <Navbar variant="dark" expand="sm" sticky="top" className={styles.navbarHeight}>
            <Container>
                <Navbar.Brand as={Link} to={'/'}>
                    Todo Application
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link as={Link} to="/privacy">
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {loggedInUser
                            ? <NavBarLoggedInView
                                user={loggedInUser}
                                onLogoutSuccessful={onLogoutSuccessful} />
                            : <NavBarLoggedOutView
                                onLogInClicked={onLogInClicked} onSignUpClicked={onSignUpClicked} />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;