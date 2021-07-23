import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import tweetsRouter from './router/tweets.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet());
const option = {
	origin: ['http://127.0.0.1:5500'],
	optionsSuccessStatus: 200,
	credentials: true,
};
app.use(cors(option));

app.use('/tweets', tweetsRouter);

app.listen(8080);
