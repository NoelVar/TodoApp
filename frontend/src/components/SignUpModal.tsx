import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/todos.api";
import * as TodoApi from "../network/todos.api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from '../styles/utils.module.css';
import { useState } from "react";
import { BadRequestError, ConflictError } from "../errors/http_errors";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

const SignUpModal = ({onDismiss, onSignUpSuccessful}: SignUpModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }  } = useForm<SignUpCredentials>();
    
    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await TodoApi.signup(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if (error instanceof ConflictError || error instanceof BadRequestError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton className={styleUtils.colorDark} data-bs-theme="dark">
                Sign Up
            </Modal.Header>
            
            <Modal.Body className={styleUtils.colorDark}>
                {errorText && 
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)} >
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Enter username..."
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username}
                    />

                    <TextInputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter email address..."
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
                    />

                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter password..."
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        variant="outline-light"
                        disabled={isSubmitting}
                        className={`mt-4 ${styleUtils.width100}`}>
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
 
export default SignUpModal;