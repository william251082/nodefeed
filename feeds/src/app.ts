import express, {Request, Response} from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import {errorHandler, NotFoundError} from "@iceshoptickets/common";
import {createFeedRouter} from "./routes/new";
import {indexFeedRouter} from "./routes";
import * as path from "path";

const app = express();
// make sure tht express is aware that it's behind a proxy of ingress-nginx and still trust it
app.set('trust proxy', true);
app.use(json());
// app.use(
//     cookieSession({
//         signed: false,
//         secure: process.env.NODE_ENV !== 'test'
//     }));

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

// app.use(currentUser);

app.use(indexFeedRouter);
app.use(createFeedRouter);
// app.use(showFeedRouter);
// app.use(updateFeed);

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };