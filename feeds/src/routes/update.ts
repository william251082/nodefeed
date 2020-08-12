import express, { Request, Response } from 'express';
import {BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@iceshoptickets/common";
import {Feed} from "../models/feed";
import {body} from "express-validator";

const router = express.Router();

router.put('/api/feeds/:id', requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be provided and must be greater that 0')
], validateRequest, async (req: Request, res: Response) => {
    const feed = await Feed.findById(req.params.id);

    if (!feed) {
        throw new NotFoundError();
    }

    if (feed.orderId) {
        throw new BadRequestError('Can not edit a reserved feed');
    }

    if (feed.userId !== req.currentUser!.id) {
        new NotAuthorizedError();
    }

    feed.set({
        title: req.body.title,
        price: req.body.price
    });
    await feed.save();
    res.send(feed);
});

export { router as updateFeed }