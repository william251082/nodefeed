import mongoose from 'mongoose';

// describes required props of new User
interface UserAttrs {
    email: string;
    password: string;
    name: string;
    status?: string;
    posts?: [];
}

// describes required props that User Model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

// describes required props that User Document has
export interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    name: string;
    status?: string;
    posts?: [];
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'I am new!'
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };