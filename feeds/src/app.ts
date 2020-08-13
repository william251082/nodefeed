import express, {Request, Response} from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import {errorHandler, NotFoundError} from "@iceshoptickets/common";
import * as path from "path";
import {authRoutes} from "./routes/auth";
// @ts-ignore
import multer from "multer";
import {feedRoutes} from "./routes/feed";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req:any, file:any, cb: any) => {
    cb(null, 'images');
  },
  filename: (req:any, file:any, cb: any) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req:any, file:any, cb: any) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(feedRoutes);
app.use(authRoutes);

// app.use((error:any, req: any, res: any) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };