"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var feedSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
    }
}, {
    // view level logic, not model
    toJSON: {
        // ret is the object that's just about to turn to JSON
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
feedSchema.statics.build = function (attrs) {
    return new Feed(attrs);
};
var Feed = mongoose_1.default.model('Feed', feedSchema);
exports.Feed = Feed;
