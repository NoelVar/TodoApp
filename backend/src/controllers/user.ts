import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from '../models/user';
import bcrypt from 'bcrypt';


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

interface signUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, signUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#*?$£%&])[a-zA-Z0-9!@#$%^&*]{6,16}$/

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username is already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "Email is already taken. Please use a different one or log in instead.");
        }

        if (!passwordRegex.test(passwordRaw)) {
            throw createHttpError(400, "Password is not strong enough.")
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        })

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error)
    }
};

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        // NEEDS SELECT CUS EMAIL AND PASSWORD IS DISCLUDED BY DEFAULT
        const user = await UserModel.findOne({ username: username }).select("+password +email").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        if (!user.password) {
            return;
        }

        const passowrdMatch = await bcrypt.compare(password, user.password);

        if (!passowrdMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            // USE sendStatus instead of status since there is no json body
            res.sendStatus(200);
        }
    });
}