import express, { Request, Response } from 'express';
import {requireAuth, validateRequest} from "@iceshoptickets/common";
import {body} from "express-validator";
import {Feed} from "../models/feed";

const router = express.Router();

router.post('/api/feeds', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const feed = Feed.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await feed.save();
    res.status(201).send(feed);
});

export { router as createFeedRouter }