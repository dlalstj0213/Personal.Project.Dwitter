import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import tweetsRouter from './routes/tweets.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet());
const option = {
	//origin: ['http://127.0.0.1:5500'],
	optionsSuccessStatus: 200,
	credentials: true,
};
app.use(cors(option));

app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

// Bad Request 처리
app.use((req, res, next) => {
	res.sendStatus(404);
});

// error 처리
app.use((error, req, res, next) => {
	console.error(error);
	res.sendStatus(500);
});

app.listen(8080);
