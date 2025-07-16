import { Button, Container } from "react-bootstrap";
import styles from '../styles/NavBar.module.css';

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLogInClicked: () => void,
}

const NavBarLoggedOutView = ({ onSignUpClicked, onLogInClicked }: NavBarLoggedOutViewProps) => {
    
    return (
        <Container className={styles.navbarGap}>
            <Button onClick={onSignUpClicked} variant="outline-light">
                Sign Up
            </Button>
            <Button onClick={onLogInClicked} variant="outline-light">
                Log In
            </Button>
        </Container>
    );
}
 
export default NavBarLoggedOutView;