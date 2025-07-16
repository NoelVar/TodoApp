import { Button, Form, Modal } from "react-bootstrap";
import { Todo } from "../models/todo";
import { useForm } from "react-hook-form";
import { TodoInput } from "../network/todos.api";
import * as TodoApi from "../network/todos.api";
import TextInputField from "./form/TextInputField";
import styleUtils from '../styles/utils.module.css';

interface AddEditTodoProps {
    todoToEdit?: Todo,
    onDismiss: () => void,
    onTodoSaved: (todo: Todo) => void,
}

const AddEditTodo = ({ todoToEdit, onDismiss, onTodoSaved }: AddEditTodoProps) => {

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<TodoInput>({
        defaultValues: {
            title: todoToEdit?.title || "",
            content: todoToEdit?.content || "",
        }
    });

    async function onSubmit(input: TodoInput) {
        try {
            let todoResponse: Todo;
            if (todoToEdit) {
                todoResponse = await TodoApi.updateTodo(todoToEdit._id, input);
            } else {
                todoResponse = await TodoApi.createTodo(input);
            }
            onTodoSaved(todoResponse)
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton className={styleUtils.colorDark} data-bs-theme="dark">
                <Modal.Title>
                    { todoToEdit ? "Edit todo" : "Add todo" }
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className={styleUtils.colorDark}>
                <Form id="addEditTodoForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Enter title..."
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.title}
                    />
                    <TextInputField
                        name="content"
                        label="Content"
                        as="textarea"
                        rows={5}
                        placeholder="Content..."
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.content}
                    />
                </Form>
            </Modal.Body>
            
            <Modal.Footer className={styleUtils.colorDark}>
                <Button 
                type="submit"
                form="addEditTodoForm"
                variant="outline-light"
                disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddEditTodo;
