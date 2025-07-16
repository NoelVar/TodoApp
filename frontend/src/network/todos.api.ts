import { BadRequestError, ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Todo } from "../models/todo";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, {
        ...init,
        credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        const errorMessage = data.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else if (response.status === 400) {
            throw new BadRequestError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("https://todoapp-rgb7.onrender.com/api/users/", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signup(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("https://todoapp-rgb7.onrender.com/api/users/signup", 
    {
        method: "POST",
        headers: {
             "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials)
    },
    )
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    return fetchData("https://todoapp-rgb7.onrender.com/api/users/login", 
        {
            method: "POST",
            headers: {
                "Content-type":"application/json",
            },
            body: JSON.stringify(credentials)
        }
    )
}

export async function logout() {
    await fetchData("https://todoapp-rgb7.onrender.com/api/users/logout", { method: "POST" })
}

// ------------------------------------------------------------------------------------------------

export async function fetchTodos(): Promise<Todo[]> {
    const response = await fetchData('https://todoapp-rgb7.onrender.com/api/todos', { method: "GET" });
    return response.json();
}

export interface TodoInput {
    title: string,
    content: string,
    completed: boolean,
}

export async function createTodo(todo: TodoInput): Promise<Todo>{
    const response = await fetchData("https://todoapp-rgb7.onrender.com/api/todos", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    });
    return response.json();
}

export async function updateTodo(todoId: string, todo: TodoInput): Promise<Todo> {
    const response = await fetchData("https://todoapp-rgb7.onrender.com/api/todos/" + todoId,
        {
            method: "PATCH",
            headers: {
                 "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
        }
    );
    return response.json();
}

export async function updateStatus(todoId: string, todo: TodoInput): Promise<Todo> {
    const response = await fetchData("https://todoapp-rgb7.onrender.com/api/todos/" + todoId + "/status",
        {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(todo),
        }
    );
    return response.json();
}

export async function deleteTodo(todoId: string) {
    await fetchData("https://todoapp-rgb7.onrender.com/api/todos/" + todoId, { method: "DELETE" });
}