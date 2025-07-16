import styles from '../styles/TodoPage.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.loggedOutBox}>
            <h1>Status 404</h1>
            <p>Page's not found please return to the previous page.</p>
        </div>
    );
}
 
export default NotFoundPage;