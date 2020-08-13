import {body} from "express-validator";
import express from 'express';
import {login, signup} from "../controllers/auth";
import {User} from "../models/user";

const router = express.Router();

router.put('/auth/signup',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom(async(value, { req }) => {
            const userDoc = await User.findOne({ email: value });
            if (userDoc) {
              return await Promise.reject('E-Mail address already exists!');
            }
          })
          .normalizeEmail(),
      body('password')
        .trim()
        .isLength({ min: 5 }),
      body('name')
        .trim()
        .not()
        .isEmpty()
    ], signup);

router.post('/auth/login', login);

export { router as authRoutes }