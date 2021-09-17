import { Mongoose } from 'mongoose';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
// import glob from 'glob';

import * as tweetsRouter from './routes/tweets.js';
import * as authRouter from './routes/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { connectDB } from './db/database.js';
import { csrfCheck } from './middleware/csrf.js';
import rateLimiter from './middleware/rate-limiter.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny')); //combined
app.use(helmet());
const option = {
	//origin: ['http://127.0.0.1:5500'],
	origin: config.cors.allowOrigin,
	optionsSuccessStatus: 200,
	credentials: true, // allow the Access-Control-Allow-Credentials
};
app.use(cors(option));
app.use(rateLimiter);
app.use(csrfCheck);

app.use(tweetsRouter.router);
app.use(authRouter.router);

// error 처리 테스트 URL
app.use('/error', (req, res, next) => {
	console.log('error test request detected');
	throw new Error();
});
// Bad Request 처리
app.use((req, res, next) => {
	console.log('Bad Request');
	res.sendStatus(404);
});
// error 처리
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	console.error('ERROR:', error);
	res.sendStatus(500);
});
connectDB()
	.then((client) => {
		console.log(`Server is started...${new Date()}`);
		const server = app.listen(config.port);
		initSocket(server);
	})
	.catch(console.error);

//############# TODO ##############
// Refactor Dynamic import routes
// error : cannot find ./routes/**/*.js files
// let cntRouters = 0;
// glob.sync('./routes/**/*.js').forEach(async (file, idx, files) => {
// 	const { router } = await import(file);
// 	typeof router === 'function' ||
// 		console.error(`Import Error:: Router is not a Function [${file}]`);
// 	router != null || console.error('Import Error:: Router Not Found Error');
// 	app.use(router); // router 동적 할당
// 	cntRouters++;
// 	if (cntRouters == files.length) {
// 		// error 처리 테스트 URL
// 		app.use('/error', (req, res, next) => {
// 			console.log('error test request detected');
// 			throw new Error();
// 		});
// 		// Bad Request 처리
// 		app.use((req, res, next) => {
// 			console.log('Bad Request');
// 			res.sendStatus(404);
// 		});
// 		// error 처리
// 		app.use((error, req, res, next) => {
// 			console.error('ERROR:', error);
// 			res.sendStatus(500);
// 		});

// 		connectDB()
// 			.then((client) => {
// 				console.log(`Server is started...${new Date()}`);
// 				const server = app.listen(config.port);
// 				initSocket(server);
// 			})
// 			.catch(console.error);
// 	}
// });
