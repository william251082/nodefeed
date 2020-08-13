import express from 'express';
import {createPost, deletePost, getPost, getPosts, updatePost} from "../controllers/feed";
import {body} from "express-validator";
import {requireAuth} from "../middleware/require-auth";

const router = express.Router();

router.get('/api/feeds', getPosts);

router.post('/api/feeds', [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('imageUrl')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 5})
        ], createPost);

router.get('/api/feeds/:postId', getPost);

router.put('/api/feeds/:postId', requireAuth, [
        body('title')
          .trim()
          .isLength({ min: 5 }),
        body('content')
          .trim()
          .isLength({ min: 5 })
        ], updatePost);

router.delete('/post/:postId', requireAuth, deletePost);

export { router as feedRoutes };