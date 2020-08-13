import {NextFunction, Response} from "express";
import {validationResult} from "express-validator";
import {IObjectExtend} from "./feed";
import {User} from "../models/user";
import jwt from "jsonwebtoken";
// @ts-ignore
import bcrypt from 'bcryptjs';

export const signup = async (req: IObjectExtend, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error: IObjectExtend = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const { email, name, password } = await req.body;
        const hashed_password = await bcrypt.hash(password, 12);
        const user = await User.build({
            email,
            name,
            password: hashed_password
        });
        const result = await user.save();
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const login = async (req: IObjectExtend, res: Response) => {
    try {
        const { email, password } = await req.body;
        let loadedUser;
        const user = await User.findOne({ email: email });
        if (!user) {
            const error: IObjectExtend = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error: IObjectExtend = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = await jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
        'somesupersecretsecret',
        { expiresIn: '1h' });
        res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    } catch (err) {
        console.log(err);
    }
};