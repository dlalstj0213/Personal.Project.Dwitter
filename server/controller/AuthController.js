import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

/**
 * [참고] HTTP 인증 프레임워크의 여러 인증 스킴
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
 */

function createJwtToken(id) {
	return jwt.sign({ id }, config.jwt.secretKey, {
		expiresIn: config.jwt.expiresInSec,
	});
}

function setToken(res, token) {
	const options = {
		maxAge: config.jwt.expiresInSec * 1000,
		httpOnly: true,
		sameSite: 'none',
		secure: true,
	};
	res.cookie('token', token, options); // HTTP-ONLY
}

async function generateCSRFToken() {
	return bcrypt.hash(config.csrf.plainToken, 1);
}

export default class AuthController {
	async signup(req, res, next) {
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

	async login(req, res, next) {
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

	async logout(req, res, next) {
		res.cookie('token', '');
		res.status(200).json({ message: 'User has been logged out' });
	}

	async me(req, res, next) {
		const user = await userRepository.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ totken: req.token, username: user.username });
	}

	async csrfToken(req, res, next) {
		const csrfToken = await generateCSRFToken();
		res.status(200).json({ csrfToken });
	}
}
