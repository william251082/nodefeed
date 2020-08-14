import mongoose from "mongoose";
import { app } from './app';
import {config} from "./config/dev";
import {socketio} from "./socket";

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

      const server = await app.listen(8080, () => {
        console.log('Listening on port 8080, feeds')
      });
      const io = socketio.init(server);
      io.on('connection', (soket: any) => {
          console.log('Client connected');
      })


  } catch (err) {
      console.error(err)
  }
};

start();
