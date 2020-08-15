import {User} from "../models/user";
// @ts-ignore
import validator from "validator";
// @ts-ignore
import bcrypt from "bcryptjs";
import {IObjectExtend} from "../controllers/feed";
import {Request} from "express";
import jwt from 'jsonwebtoken';
import {Feed} from "../models/feed";

export default {
    createUser: async function({ userInput }: any, req: Request) {
    //   const email = args.userInput.email;
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error: IObjectExtend = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      throw new Error('User exists already!');
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser, _id: createdUser._id.toString() };
  },
    login: async function({ email, password }: any) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error: IObjectExtend = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error: IObjectExtend = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    return { token: token, userId: user._id.toString() };
  },
    createPost: async function({ postInput }: any, req: IObjectExtend) {
    if (!req.isAuth) {
      const error: IObjectExtend = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid.' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid.' });
    }
    if (errors.length > 0) {
      const error: IObjectExtend = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error: IObjectExtend = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }
    let creator: any;
    let createdFeed: any;
    creator = user;
    const post = Feed.build({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator
    });
    const createdPost = await post.save();
    createdFeed = createdPost;
    creator.posts.push(createdPost);
    await creator.save();
    return {
      ...createdPost,
      _id: createdPost._id.toString(),
      createdAt: createdFeed.createdAt.toISOString(),
      updatedAt: createdFeed.updatedAt.toISOString()
    };
  }
};