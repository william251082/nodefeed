import mongoose from 'mongoose';

// describes required props of new User
interface FeedAttrs {
    title: string;
    price: number;
    userId: string;
}

// describes required props that User Model has
interface FeedModel extends mongoose.Model<FeedDoc>{
    build(attrs: FeedAttrs): FeedDoc;
}

// describes required props that User Document has
interface FeedDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

const feedSchema = new mongoose.Schema({
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
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

feedSchema.statics.build = (attrs: FeedAttrs) => {
    return new Feed(attrs);
};

const Feed = mongoose.model<FeedDoc, FeedModel>('Feed', feedSchema);

export { Feed };