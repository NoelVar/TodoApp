import { Container } from "react-bootstrap";
import TodoPageLoggedInView from "../components/TodoPageLoggedInView";
import TodoPageLoggedOutView from "../components/TodoPageLoggedOutView";
import styles from '../styles/TodoPage.module.css';
import { User } from "../models/user";

interface TodoPageProps {
    loggedInUser: User | null,
}

const TodoPage = ({ loggedInUser }: TodoPageProps) => {
    return (
        <Container className={styles.todosPage}>
            <>
                {loggedInUser
                    ? <TodoPageLoggedInView />
                    : <TodoPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default TodoPage;