import mongoose from 'mongoose';

// describes required props of new User
interface FeedAttrs {
    title: string;
    imageUrl: string;
    content: string;
    creator: mongoose.Schema.Types.ObjectId;
}

// describes required props that User Model has
interface FeedModel extends mongoose.Model<FeedDoc>{
    build(attrs: FeedAttrs): FeedDoc;
}

// describes required props that User Document has
interface FeedDoc extends mongoose.Document {
    title: string;
    imageUrl: string;
    content: string;
    creator: mongoose.Schema.Types.ObjectId;
}

const feedSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },  {
    timestamps: true
});

feedSchema.statics.build = (attrs: FeedAttrs) => {
    return new Feed(attrs);
};

const Feed = mongoose.model<FeedDoc, FeedModel>('Feed', feedSchema);

export { Feed };