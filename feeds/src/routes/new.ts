import express from 'express';
import {createPost} from "../controllers/feed";
import {body} from "express-validator";
import {validateRequest} from "@iceshoptickets/common";

const router = express.Router();

router.post('/api/feeds',
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('cotent')
            .trim()
            .isLength({min: 5})
        ],
    validateRequest,
    createPost);

export { router as createFeedRouter }