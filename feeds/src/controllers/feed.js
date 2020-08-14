"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var feed_1 = require("../models/feed");
var express_validator_1 = require("express-validator");
var user_1 = require("../models/user");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
exports.getPosts = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var currentPage, perPage, totalItems, feeds, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                currentPage = req.query.page || 1;
                perPage = 2;
                totalItems = void 0;
                return [4 /*yield*/, feed_1.Feed.find().countDocuments()];
            case 1:
                totalItems = _a.sent();
                return [4 /*yield*/, feed_1.Feed.find().skip((currentPage - 1) * perPage).limit(perPage)];
            case 2:
                feeds = _a.sent();
                res.status(200).json({
                    message: 'Fetched posts successfully.',
                    posts: feeds,
                    totalItems: totalItems
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createPost = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var errors, error, error, imageUrl, _a, title, content, creator, feed, user, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    error = new Error('Validation failed, entered data is incorrect.');
                    error.statusCode = 422;
                    throw error;
                }
                if (!req.file) {
                    error = new Error('No image provided.');
                    error.statusCode = 422;
                    throw error;
                }
                imageUrl = req.file.path;
                return [4 /*yield*/, req.body];
            case 1:
                _a = _b.sent(), title = _a.title, content = _a.content;
                creator = void 0;
                return [4 /*yield*/, feed_1.Feed.build({
                        title: title,
                        imageUrl: imageUrl,
                        content: content,
                        creator: req.userId
                    })];
            case 2:
                feed = _b.sent();
                return [4 /*yield*/, feed.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, user_1.User.findById(req.userId)];
            case 4:
                user = _b.sent();
                creator = user;
                if (!(user !== null)) return [3 /*break*/, 7];
                return [4 /*yield*/, creator.posts.push(feed)];
            case 5:
                _b.sent();
                return [4 /*yield*/, creator.save()];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                res.status(201).json({
                    message: 'Post created successfully!',
                    feed: feed,
                    creator: { _id: creator._id, name: creator.name }
                });
                return [3 /*break*/, 9];
            case 8:
                err_2 = _b.sent();
                console.log(err_2);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getPost = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var postId, feed, error, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                postId = req.params.postId;
                return [4 /*yield*/, feed_1.Feed.findById(postId)];
            case 1:
                feed = _a.sent();
                if (!feed) {
                    error = new Error('Could not find post.');
                    error.statusCode = 404;
                    throw error;
                }
                res.status(200).json({ message: 'Post fetched.', feed: feed });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                if (!err_3.statusCode) {
                    err_3.statusCode = 500;
                }
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePost = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var postId, errors, error, _a, title, content, imageUrl, error, feed, error, error, result, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                postId = req.params.postId;
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    error = new Error('Validation failed, entered data is incorrect.');
                    error.statusCode = 422;
                    throw error;
                }
                _a = req.body, title = _a.title, content = _a.content;
                imageUrl = req.body.image;
                if (req.file) {
                    imageUrl = req.file.path;
                }
                if (!imageUrl) {
                    error = new Error('No file picked.');
                    error.statusCode = 422;
                    throw error;
                }
                return [4 /*yield*/, feed_1.Feed.findById(postId)];
            case 1:
                feed = _b.sent();
                if (!feed) {
                    error = new Error('Could not find post.');
                    error.statusCode = 404;
                    throw error;
                }
                if (feed.creator.toString() !== req.userId) {
                    error = new Error('Not authorized!');
                    error.statusCode = 403;
                    throw error;
                }
                if (imageUrl !== feed.imageUrl) {
                    clearImage(feed.imageUrl);
                }
                feed.title = title;
                feed.imageUrl = imageUrl;
                feed.content = content;
                return [4 /*yield*/, feed.save()];
            case 2:
                result = _b.sent();
                res.status(200).json({ message: 'Post updated!', post: result });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                console.log(err_4);
                if (!err_4.statusCode) {
                    err_4.statusCode = 500;
                }
                next(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var postId, feed, error, error, creator, user, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                postId = req.params.postId;
                return [4 /*yield*/, feed_1.Feed.findById(postId)];
            case 1:
                feed = _a.sent();
                if (!feed) {
                    error = new Error('Could not find post.');
                    error.statusCode = 404;
                    throw error;
                }
                if (feed.creator.toString() !== req.userId) {
                    error = new Error('Not authorized!');
                    error.statusCode = 403;
                    throw error;
                }
                // Check logged in user
                clearImage(feed.imageUrl);
                return [4 /*yield*/, feed_1.Feed.findByIdAndRemove(postId)];
            case 2:
                _a.sent();
                creator = void 0;
                return [4 /*yield*/, user_1.User.findById(req.userId)];
            case 3:
                user = _a.sent();
                if (!(user !== null)) return [3 /*break*/, 6];
                creator = user;
                return [4 /*yield*/, creator.posts.pull(postId)];
            case 4:
                _a.sent();
                return [4 /*yield*/, creator.save()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                res.status(200).json({ message: 'Deleted post.' });
                return [3 /*break*/, 8];
            case 7:
                err_5 = _a.sent();
                console.log(err_5);
                if (!err_5.statusCode) {
                    err_5.statusCode = 500;
                }
                next(err_5);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var clearImage = function (filePath) {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, function (err) { return console.log(err); });
};
