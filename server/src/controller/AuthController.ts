import { Request, Response, NextFunction, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

/**
 * [참고] HTTP 인증 프레임워크의 여러 인증 스킴
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
 */

function createJwtToken(id: string | undefined) {
	return jwt.sign({ id }, config.jwt.secretKey, {
		expiresIn: config.jwt.expiresInSec,
	});
}

class Cookie implements CookieOptions {
	maxAge?: number;
	signed?: boolean;
	expires?: Date;
	httpOnly?: boolean;
	path?: string;
	domain?: string;
	sameSite?: boolean | 'lax' | 'strict' | 'none';
	secure?: boolean;
}

function setToken(res: Response, token: string) {
	// const options = {
	// 	maxAge: config.jwt.expiresInSec * 1000,
	// 	httpOnly: true,
	// 	sameSite: 'none',
	// 	secure: true,
	// };
	const cookie = new Cookie();
	cookie.maxAge = config.jwt.expiresInSec * 1000;
	cookie.httpOnly = true;
	cookie.sameSite = 'none';
	cookie.secure = true;
	res.cookie('token', token, cookie); // HTTP-ONLY
}

async function generateCSRFToken() {
	return bcrypt.hash(config.csrf.plainToken, 1);
}

export default class AuthController {
	async signup(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void | Response> {
		const { username, password, name, email, img_url } = req.body;
		const found = await userRepository.findByUsername(username);
		if (found) {
			return res.status(409).json({ message: `${username} already exists` });
		}

		// 사용자 패스워드 해싱
		const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
		const userId = await userRepository.createUser({
			username,
			password: hashed,
			name,
			email,
			img_url,
		});
		const token = createJwtToken(userId); // cookie header
		setToken(res, token);
		res.status(201).json({ token, username });
	}

	async login(req: Request, res: Response, next: NextFunction) {
		const { username, password } = req.body;
		const user = await userRepository.findByUsername(username);
		if (!user) {
			return res.status(401).json({ message: 'Invalid user or password' });
		}
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Invalid user or password' });
		}
		const token = createJwtToken(user.id);
		setToken(res, token);
		res.status(200).json({ token, username });
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		res.cookie('token', '');
		res.status(200).json({ message: 'User has been logged out' });
	}

	async me(req: any, res: Response, next: NextFunction) {
		const user = await userRepository.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ totken: req.token, username: user.username });
	}

	async csrfToken(req: Request, res: Response, next: NextFunction) {
		const csrfToken = await generateCSRFToken();
		res.status(200).json({ csrfToken });
	}
}
