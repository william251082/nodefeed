"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var feed_1 = require("../controllers/feed");
var express_validator_1 = require("express-validator");
var common_1 = require("@iceshoptickets/common");
var router = express_1.default.Router();
exports.createFeedRouter = router;
router.post('/api/feeds', [
    express_validator_1.body('title')
        .trim()
        .isLength({ min: 5 }),
    express_validator_1.body('cotent')
        .trim()
        .isLength({ min: 5 })
], common_1.validateRequest, feed_1.createPost);
