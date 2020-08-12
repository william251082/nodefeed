import express, { Request, Response } from 'express';
import { Feed } from "../models/feed";
import {NotFoundError} from "@iceshoptickets/common";

const router = express.Router();

router.get('/api/feeds/:id', async (req: Request, res: Response) => {
    const feed = await Feed.findById(req.params.id);

    if (!feed) {
        throw new NotFoundError();
    }

    res.send(feed);
});

export { router as showFeedRouter };