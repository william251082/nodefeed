import {Request, Response} from "express";

export const getPosts = async (req: Request, res: Response) => {
    try {
        // const feeds = await Feed.find({
        //     orderId: undefined,
        // });
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
