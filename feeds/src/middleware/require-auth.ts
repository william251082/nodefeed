import {NextFunction, Response} from "express";
import {IObjectExtend} from "../controllers/feed";
import jwt from "jsonwebtoken";

export const requireAuth = (req: IObjectExtend, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error: IObjectExtend = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
      const error: IObjectExtend = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
};