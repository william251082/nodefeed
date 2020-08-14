import mongoose from "mongoose";
import { app } from './app';
import {config} from "./config/dev";

const start = async () => {
    if (!config.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!config.mongoURI) {
        throw new Error('MONGO_URI must be defined');
    }
  try {
      await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      console.log('Connected to Mongodb');

      await app.listen(8080, () => {
        console.log('Listening on port 8080, feeds')
      });
  } catch (err) {
      console.error(err)
  }
};

start();
