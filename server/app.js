import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import glob from 'glob';

import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './db/database.js';

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

let cntRouters = 0;
glob.sync('./routes/**/*.js').forEach(async (file, idx, files) => {
	const { router } = await import(file);
	typeof router === 'function' ||
		console.error(`Import Error:: Router is not a Function [${file}]`);
	router != null || console.error('Import Error:: Router Not Found Error');
	app.use(router); // router 동적 할당
	cntRouters++;
	if (cntRouters == files.length) {
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
		app.use((error, req, res, next) => {
			console.error('ERROR:', error);
			res.sendStatus(500);
		});

		// ORM 및 DB 연동 후 소켓, 서버 시작
		sequelize.sync().then(() => {
			const server = app.listen(config.host.port);
			initSocket(server);
		});
	}
});
