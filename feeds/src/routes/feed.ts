import express from 'express';
import {createPost, deletePost, getPost, getPosts, updatePost} from "../controllers/feed";
import {body} from "express-validator";
import {requireAuth} from "../middleware/require-auth";

const router = express.Router();

router.get('/api/feeds', requireAuth, getPosts);

router.post('/api/feed', [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 5})
        ], requireAuth, createPost);

router.get('/api/feed/:postId', requireAuth, getPost);

router.put('/api/feed/:postId', [
        body('title')
          .trim()
          .isLength({ min: 5 }),
        body('content')
          .trim()
          .isLength({ min: 5 })
        ], requireAuth, updatePost);

router.delete('/api/feed/:postId', requireAuth, deletePost);

export { router as feedRoutes };