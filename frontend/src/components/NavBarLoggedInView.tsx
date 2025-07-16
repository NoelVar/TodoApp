import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as TodoApi from '../network/todos.api';

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await TodoApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    return (
        <>
            <Navbar.Text className="me-4">
                {user.username}
            </Navbar.Text>
            <Button onClick={logout} variant="outline-danger">Logout</Button>
        </>
    );
}

export default NavBarLoggedInView;