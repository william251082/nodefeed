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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var path = __importStar(require("path"));
var bodyParser = __importStar(require("body-parser"));
var multer_1 = __importDefault(require("multer"));
var common_1 = require("@iceshoptickets/common");
var express_graphql_1 = require("express-graphql");
// @ts-ignore
var schema_1 = __importDefault(require("./graphql/schema"));
// @ts-ignore
var resolvers_1 = __importDefault(require("./graphql/resolvers"));
var auth_1 = __importDefault(require("./middleware/auth"));
var file_1 = require("./util/file");
var app = express_1.default();
exports.app = app;
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        req.file = file;
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use(bodyParser.json());
app.use(multer_1.default({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use('/images', express_1.default.static(path.join(__dirname, 'images')));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(auth_1.default);
app.put('/post-image', function (req, res) {
    if (!req.isAuth) {
        throw new Error('Not authenticated!');
    }
    if (!req.file) {
        return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
        file_1.clearImage(req.body.oldPath);
    }
    return res
        .status(201)
        .json({ message: 'File stored.', filePath: req.file.path });
});
// @ts-ignore
app.use('/graphql', express_graphql_1.graphqlHTTP({
    schema: schema_1.default,
    rootValue: resolvers_1.default,
    graphiql: true,
    formatError: function (err) {
        if (!err.originalError) {
            return err;
        }
        var data = err.originalError.data;
        var message = err.message || 'An error occurred';
        var code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
    }
}));
app.use(function (error, req, res) {
    console.log('ERROR', error);
    var status = error.statusCode || 500;
    var message = error.message;
    var data = error.data;
    res({ message: message, data: data });
});
app.all('*', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        throw new common_1.NotFoundError();
    });
}); });
app.use(common_1.errorHandler);
