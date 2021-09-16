import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
	/**
	 * 1. Cookie (for Browser)
	 * 2. Header (for Non-Browser Client)
	 */

	let token;
	// 1. Header 안에 Authorization 키의 값을 가져온다.
	const authHeader = req.get('Authorization');
	// 2. Header 안에 해당 키가 있고 Bearer로 시작할 경우 토큰 읽기
	if (authHeader && authHeader.startsWith('Bearer')) {
		// 3. 토큰 READ
		token = authHeader.split(' ')[1];
	}

	// 4. 만일 토큰이 Header에 없다면 쿠키 체크
	if (!token) {
		token = req.cookies['token'];
	}

	// 5. 만일 Header, 쿠키에도 토큰이 없을 경우 401 에러를 보내준다.
	if (!token) {
		return res.status(401).json(AUTH_ERROR);
	}

	// TODO: Make it secure!
	// 6. 토큰을 검증한다.
	jwt.verify(token, config.jwt.secretKey, async (error, decode) => {
		if (error) {
			return res.status(401).json(AUTH_ERROR);
		}
		const user = await userRepository.findById(decode.id);
		if (!user) {
			return res.status(401).json(AUTH_ERROR);
		}
		req.userId = user.id;
		req.token = token;
		next();
	});
};
