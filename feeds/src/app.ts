import express, {Request, Response} from 'express';
import 'express-async-errors'
import * as path from "path";
import * as bodyParser from "body-parser";
import multer from "multer";
import {errorHandler, NotFoundError} from "@iceshoptickets/common";

import { graphqlHTTP } from "express-graphql";
// @ts-ignore
import graphqlSchema from "./graphql/schema";
// @ts-ignore
import graphqlResolver from './graphql/resolvers';
import auth from "./middleware/auth";

const app = express();

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, path.join(__dirname, 'images'));
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req:any, file:any, cb: any) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    req.file = file;
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage, fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

// @ts-ignore
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err: any) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred';
      const code = err.originalError.code || 500;
      return { message, status: code, data}
    }
}));

app.use((error:any, req: any, res: any) => {
  console.log('ERROR', error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res({ message: message, data: data });
});

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };