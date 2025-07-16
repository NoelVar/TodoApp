import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Todo as TodoModel } from '../models/todo';
import * as TodosApi from "../network/todos.api";
import AddEditTodo from "./AddEditTodo";
import styles from '../styles/TodoPage.module.css';
import stylesUtils from '../styles/utils.module.css';
import Todo from "./Todos";

const TodoPageLoggedInView = () => {
    // TELL TYPE SCRIPT WHAT IS THE TYPE (the Todo Created in models)
    const [todos, setTodos] = useState<TodoModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTodoLoadingError, setShowTodoLoadingError] = useState(false);
    const [showAddTodo, setShowAddTodo] = useState(false);
    const [todoToEdit, setTodoToEdit] = useState<TodoModel | null>(null);


    useEffect(() => {
        async function loadTodos() {
            try {
                setShowTodoLoadingError(false);
                setLoading(true);
                const todos = await TodosApi.fetchTodos();
                setTodos(todos);
            } catch (error) {
                console.error(error);
                setShowTodoLoadingError(true);
            } finally {
                setLoading(false);
            }
        }
        loadTodos();
    }, []);

    async function deleteTodo(todo: TodoModel) {
        try {
            await TodosApi.deleteTodo(todo._id);
            setTodos(todos.filter(existingTodo => existingTodo._id !== todo._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function updateStatus(todo: TodoModel) {
        try {
            const updatedStatus = await TodosApi.updateStatus(todo._id, todo);
            setTodos(todos.map((existingTodo) => existingTodo._id === updatedStatus._id ? updatedStatus : existingTodo));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const todoGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.todosGrid}`}>
            {todos.map(todo => (
                <Col key={todo._id}>
                    <Todo
                        todo={todo}
                        className={styles.todo}
                        onTodoClicked={setTodoToEdit}
                        onDeleteTodoClicked={deleteTodo}
                        onStatusChange={updateStatus}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <Button
                className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
                onClick={() => setShowAddTodo(true)}
                variant='outline-light'>
                <FaPlus />
                Add To do
            </Button>
            {loading && <Spinner animation='border' variant='danger' />}
            {showTodoLoadingError && 
                <div className={styles.loggedOutBox}>
                    <h1>Error</h1>
                    <p>Something went wrong. Please refresh the page.</p>
                </div>
            }
            {!loading && !showTodoLoadingError &&
                // FRAGMENT <></> ALLOWS TO PUT MULTIPLE ELEMENTS INSTEAD OF ONE
                <>
                    {
                        todos.length > 0
                            ? todoGrid
                            : <div className={styles.loggedOutBox}>
                                <h1>Heads up!</h1>
                                <p>You don't have any notes yet.</p>
                            </div>
                    }
                </>
            }
            {showAddTodo &&
                <AddEditTodo
                    onDismiss={() => setShowAddTodo(false)}
                    onTodoSaved={(newTodo) => {
                        setTodos([...todos, newTodo])
                        setShowAddTodo(false);
                    }}
                />
            }
            {todoToEdit &&
                <AddEditTodo
                    todoToEdit={todoToEdit}
                    onDismiss={() => setTodoToEdit(null)}
                    onTodoSaved={(updatedTodo) => {
                        setTodos(todos.map((existingTodo) => existingTodo._id === updatedTodo._id ? updatedTodo : existingTodo));
                        setTodoToEdit(null);
                    }}
                />
            }
        </>
    );
}

export default TodoPageLoggedInView;