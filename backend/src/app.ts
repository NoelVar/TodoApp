import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import toDoRoutes from "./routes/toDos";
import UserRouters from './routes/users';
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from './util/validateEnv';
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://todo-typescript-project.netlify.app'],
    credentials: true
};

app.use(cors(corsOptions));

// Using morgan to log req and res to server (GET /api/todos/6872352a2d399f9d57544dd1 200 155.832 ms - 207)
app.use(morgan("dev"));

// NOTE: sets up express so it accepts json
app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.CONN_STRING
    }),
}));

// NOTE: Endpoint for HTTP requests
app.use("/api/todos", requiresAuth, toDoRoutes);
app.use("/api/users", UserRouters);

// NOTE: Endpoint to handle error when a non-existent route is accessed
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// NOTE: Error handler ( Need types when its an error handler in TS )
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred.";
    let statusCode = 500;
    // NOTE: Check if it is actually the type of error
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;