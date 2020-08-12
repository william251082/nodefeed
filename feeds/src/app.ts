import express, {Request, Response} from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {currentUser, errorHandler, NotFoundError} from "@iceshoptickets/common";
import {createFeedRouter} from "./routes/new";
import {showFeedRouter} from "./routes/show";
import {indexFeedRouter} from "./routes";
import {updateFeed} from "./routes/update";

const app = express();
// make sure tht express is aware that it's behind a proxy of ingress-nginx and still trust it
app.set('trust proxy', true);
app.use(json());
// app.use(
//     cookieSession({
//         signed: false,
//         secure: process.env.NODE_ENV !== 'test'
//     }));

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

// app.use(createFeedRouter);
// app.use(showFeedRouter);
app.use(indexFeedRouter);
// app.use(updateFeed);

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };