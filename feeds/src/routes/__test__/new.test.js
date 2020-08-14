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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var app_1 = require("../../app");
var feed_1 = require("../../models/feed");
it('has a route handler that is listening to /api/feeds for post requests', function () { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supertest_1.default(app_1.app)
                    .post('/api/feeds')
                    .send({})];
            case 1:
                response = _a.sent();
                expect(response.status).not.toEqual(404);
                return [2 /*return*/];
        }
    });
}); });
it('can only be accessed if user is signed in', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supertest_1.default(app_1.app).post('/api/feeds').send({}).expect(401)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it('returns a status other than 401 if user is signed in', function () { return __awaiter(_this, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supertest_1.default(app_1.app)
                    .post('/api/feeds')
                    .set('Cookie', global.signin())
                    .send({})];
            case 1:
                response = _a.sent();
                expect(response.status).not.toEqual(401);
                return [2 /*return*/];
        }
    });
}); });
it('returns an error if an invalid title is provided', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supertest_1.default(app_1.app)
                    .post('/api/feeds')
                    .set('Cookie', global.signin())
                    .send({
                    title: '',
                    price: -10,
                })
                    .expect(400)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it('returns an error if an invalid price is provided', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supertest_1.default(app_1.app)
                    .post('/api/feeds')
                    .set('Cookie', global.signin())
                    .send({
                    title: 'valid title',
                })
                    .expect(400)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it('creates a feed with valid inputs', function () { return __awaiter(_this, void 0, void 0, function () {
    var feeds, title;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, feed_1.Feed.find({})];
            case 1:
                feeds = _a.sent();
                expect(feeds.length).toEqual(0);
                title = 'valid title';
                return [4 /*yield*/, supertest_1.default(app_1.app)
                        .post('/api/feeds')
                        .set('Cookie', global.signin())
                        .send({
                        title: title,
                        price: 1.00,
                    })
                        .expect(201)];
            case 2:
                _a.sent();
                return [4 /*yield*/, feed_1.Feed.find({})];
            case 3:
                feeds = _a.sent();
                expect(feeds.length).toEqual(1);
                expect(feeds[0].title).toEqual(title);
                return [2 /*return*/];
        }
    });
}); });
it('publishes an event', function () { return __awaiter(_this, void 0, void 0, function () {
    var title;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = 'valid title';
                return [4 /*yield*/, supertest_1.default(app_1.app)
                        .post('/api/feeds')
                        .set('Cookie', global.signin())
                        .send({
                        title: title,
                        price: 1.00,
                    })
                        .expect(201)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
