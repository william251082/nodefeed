import express from 'express';
import {createPost} from "../controllers/feed";

const router = express.Router();

router.post('/api/feeds', createPost);

export { router as createFeedRouter }