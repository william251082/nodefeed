import {Request, Response} from "express";
import {Feed} from "../models/feed";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const feeds = await Feed.find();
        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: feeds,
            totalItems: 1
        });
    } catch (err) {
        console.log(err);
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, imageUrl, creator } = await req.body;
        const feed = Feed.build({
            title,
            imageUrl,
            content,
            creator
        });
        await feed.save();

        res.status(201).send({
            message: 'Post created successfully!',
            post: { _id: new Date().toISOString(), title, imageUrl, content, creator },
        });
    } catch (err) {
        console.log(err);
    }
};
