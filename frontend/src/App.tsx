import { useEffect, useState } from 'react';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { User } from './models/user';
import * as TodosApi from "./network/todos.api";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import TodoPage from './pages/TodoPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './styles/App.module.css';

function App() {

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLogInModal, setShowLogInModal] = useState(false);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await TodosApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, []);

    return (
        <BrowserRouter>
            <div>
                <NavBar
                    loggedInUser={loggedInUser}
                    onSignUpClicked={() => setShowSignUpModal(true)}
                    onLogInClicked={() => setShowLogInModal(true)}
                    onLogoutSuccessful={() => setLoggedInUser(null)}
                />
                
                <Container className={styles.pageContainer}>
                    <Routes>
                        <Route 
                            path='/'
                            element={<TodoPage loggedInUser={loggedInUser} />}
                        />
                        <Route
                            path='/privacy'
                            element={<PrivacyPage />}
                        />
                        <Route
                            path='/*'
                            element={<NotFoundPage />}
                        />
                    </Routes>
                </Container>

                {showSignUpModal &&
                    <SignUpModal
                        onDismiss={() => setShowSignUpModal(false)}
                        onSignUpSuccessful={(user) => {
                            setLoggedInUser(user);
                            setShowSignUpModal(false);
                            setShowLogInModal(false);
                        }}
                    />
                }
                {showLogInModal &&
                    <LoginModal
                        onDismiss={() => setShowLogInModal(false)}
                        onLoginSuccessful={(user) => {
                            setLoggedInUser(user);
                            setShowSignUpModal(false);
                            setShowLogInModal(false);
                        }}
                    />
                }
            </div>
        </BrowserRouter>
    );
}

export default App;
