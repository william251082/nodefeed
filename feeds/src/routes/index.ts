import express from 'express';
import {getPosts} from "../controllers/feed";

const router = express.Router();

router.get('/api/feeds', getPosts);

export { router as indexFeedRouter };