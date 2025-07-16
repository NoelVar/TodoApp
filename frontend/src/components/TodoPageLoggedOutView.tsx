import styles from '../styles/TodoPage.module.css';

const TodoPageLoggedOutView = () => {
    return (
        <div className={styles.loggedOutBox}>
            <h1>You are currently logged out!</h1>
            <p>Please log in to see your list of To Do's.</p>
        </div>
    );
}

export default TodoPageLoggedOutView;