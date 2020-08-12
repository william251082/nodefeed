import {NextFunction, Request, Response} from "express";
import {validateRequest} from "@iceshoptickets/common";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const feeds = await {
            posts: [
                {
                    _id: '4264u',
                    title: '4264u',
                    content: '4264u',
                    imageUrl: 'https://www.wikihow.com/images/thumb/d/dd/Get-the-URL-for-Pictures-Step-7-Version-3.jpg/v4-460px-Get-the-URL-for-Pictures-Step-7-Version-3.jpg.webp',
                    creator: {
                        name: 'Will'
                    },
                    createdAt: new Date(),
                }
            ]
        };
        res.send(feeds);
    } catch (err) {
        console.log(err);
    }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content } = await req.body;

        res.status(201).send({
            message: 'Post created successfully!',
            post: { _id: new Date().toISOString(), title, content },
        });
    } catch (err) {
        console.log(err);
    }
};
