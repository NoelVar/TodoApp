import { RequestHandler } from "express";
import toDoModel from "../models/toDo";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { ExplainableCursor } from "mongodb";
import { assertIsDefined } from "../util/assertIsDefined";

// NOTE GET ALL -----------------------------------------------------------------------------------
export const getToDos: RequestHandler = async (req, res, next) => {
    // NOTE: Executes find operation, exec returns a promise
    // Its async since it takes a while to execute, and we dont want the server to wait for the promise to conclude

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);


        const todos = await toDoModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
};

// NOTE GET ONE -----------------------------------------------------------------------------------
export const getToDo: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        // 1st line of defense
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Invalid todo id");
        }

        const todo = await toDoModel.findById(todoId).exec();
        
        // 1st line of defense
        if (!todo) {
            throw createHttpError(404, "Todo not found");
        }

        if (!todo.userId?.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this Todo");
        }

        res.status(200).json(todo);    
    } catch (error) {
        next(error)
    }
};

// NOTE CREATE ------------------------------------------------------------------------------------
// 1st line of defense is our code, then the mongo error which will default to 500 since we have an error handler
// Create a interface so the program knows what type of variables we expect
interface CreateToDoBody {
    title?: string, // NOTE: might not send value so ? is needed (could be 'undefined')
    content?: string,
}

export const createToDo: RequestHandler<unknown, unknown, CreateToDoBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const completed = false;
    const authenticatedUserId = req.session.userId;
    
    try {
        assertIsDefined(authenticatedUserId);

        if (!title || !content) {
            throw createHttpError(400, "All of the fields must be completed before creation");
        }

        const newToDo = await toDoModel.create({
            userId: authenticatedUserId,
            title: title,
            content: content,
            completed: completed
        });

        res.status(201).json(newToDo);
    } catch (error) {
        next(error);
    }
};


// NOTE UPDATE ------------------------------------------------------------------------------------
interface UpdateTodoParams  {
    todoId: string,
}

interface UpdateTodoBody {
    title?: string,
    content?: string,
}

export const updateToDo: RequestHandler<UpdateTodoParams, unknown, UpdateTodoBody, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    const newTitle = req.body.title;
    const newContent = req.body.content;
    const authenticatedUserId = req.session.userId;
    
    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Invalid todo id");
        }

        if (!newTitle || !newContent) {
            throw createHttpError(400, "All of the fields must be completed before updating");
        }

        const todo = await toDoModel.findById(todoId);

        if (!todo) {
            throw createHttpError(404, "Todo not found");
        }

        if (!todo.userId?.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this Todo");
        }

        todo.title = newTitle;
        todo.content = newContent;

        const updatedTodo = await todo.save();

        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
}

// NOTE DELETE ------------------------------------------------------------------------------------  
export const deleteTodo: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Invalid todo id");
        }

        const todo = await toDoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Todo not found");
        }

        if (!todo.userId?.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this Todo");
        }

        await toDoModel.findByIdAndDelete(todoId);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

// NOTE CHECK -------------------------------------------------------------------------------------
interface changeStatusBody {
    completed?: boolean,
}

export const changeStatus: RequestHandler<UpdateTodoParams, unknown, changeStatusBody, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    const completed = req.body.completed;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Invalid todo id");
        }
        
        if (completed === undefined) {
            throw createHttpError(404, "Parameter needs to be provided")
        }

        const todo = await toDoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Todo not found");
        }

        if (!todo.userId?.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this Todo");
        }

        todo.completed = !completed;

        const updatedTodo = await todo.save();

        res.status(200).json(updatedTodo);

    } catch (error) {
        next(error);
    }
}