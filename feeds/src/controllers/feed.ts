import {NextFunction, Request, Response} from "express";
import {Feed} from "../models/feed";
import {validationResult} from "express-validator";
import {User} from "../models/user";
import * as path from "path";
import * as fs from "fs";

export interface IObjectExtend {[k: string]: any}

export const getPosts = async (req: Request, res: Response) => {
    try {
        const currentPage: any = req.query.page || 1;
        const perPage = 2;
        let totalItems;
        totalItems = await Feed.find().countDocuments();
        const feeds = await Feed.find().skip((currentPage - 1) * perPage).limit(perPage);
        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: feeds,
            totalItems
        });
    } catch (err) {
        console.log(err);
    }
};

export const createPost = async (req: IObjectExtend, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error: IObjectExtend = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        if (!req.file) {
            const error: IObjectExtend = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path;
        const { title, content } = await req.body;
        let creator: any;
        const feed = await Feed.build({
            title,
            imageUrl,
            content,
            creator: req.userId
        });
        await feed.save();
        const user = await User.findById(req.userId);
        creator = user;
        if (user !== null) {
            await creator.posts.push(feed);
            await creator.save();
        }
        res.status(201).json({
            message: 'Post created successfully!',
            feed,
            creator: { _id: creator._id, name: creator.name }
        });
    } catch (err) {
        console.log(err);
    }
};

export const getPost = async (req: IObjectExtend, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId;
        const feed = await Feed.findById(postId);
        if (!feed) {
            const error: IObjectExtend = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Post fetched.', feed});
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const updatePost = async (req: IObjectExtend, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error: IObjectExtend = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const {title, content} = req.body;
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = req.file.path;
        }
        if (!imageUrl) {
            const error: IObjectExtend = new Error('No file picked.');
            error.statusCode = 422;
            throw error;
        }
        const feed = await Feed.findById(postId);
        if (!feed) {
            const error: IObjectExtend = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if (feed.creator.toString() !== req.userId) {
            const error: IObjectExtend = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl !== feed.imageUrl) {
            clearImage(feed.imageUrl);
        }
        feed.title = title;
        feed.imageUrl = imageUrl;
        feed.content = content;
        const result = await feed.save();
        res.status(200).json({ message: 'Post updated!', post: result });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const deletePost = async (req: IObjectExtend, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.postId;
        const feed = await Feed.findById(postId);
        if (!feed) {
            const error: IObjectExtend = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if (feed.creator.toString() !== req.userId) {
            const error: IObjectExtend = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        // Check logged in user
        clearImage(feed.imageUrl);
        await Feed.findByIdAndRemove(postId);
        let creator: any;
        const user = await User.findById(req.userId);
        if (user !== null) {
            creator = user;
            await creator.posts.pull(postId);
            await creator.save();
        }
        res.status(200).json({ message: 'Deleted post.' });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
