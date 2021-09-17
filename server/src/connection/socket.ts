import { NextFunction } from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { config } from '../config.js';

// npm i socket-io
class Socket {
	io: Server;

	constructor(server: http.Server) {
		// 소켓 서버 생성
		this.io = new Server(server, {
			cors: {
				origin: config.cors.allowOrigin,
			},
		});
		this.io.use((socket, next): void => {
			// 토큰 검증
			const token = socket.handshake.auth.token;
			if (!token) {
				return next(new Error('Authentication error'));
			}
			jwt.verify(
				token,
				config.jwt.secretKey,
				(
					error: VerifyErrors | null,
					decode: JwtPayload | undefined
				): void | NextFunction => {
					if (error) {
						return next(new Error('Authentication error'));
					}
					next();
				}
			);
		});
		this.io.on('connection', (socket) => {
			console.log('Socket client connected');
		});
	}
}

let socket: Socket;
export function initSocket(server: http.Server): void {
	if (!socket) socket = new Socket(server);
}

export function getSocketIO(): Server {
	if (!socket) throw new Error('Please call init first');
	return socket.io;
}
