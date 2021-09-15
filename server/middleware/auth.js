import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
	// 1. Header 안에 Authorization 키의 값을 가져온다.
	const authHeader = req.get('Authorization');
	// 2. Header 안에 해당 키가 없거나 Bearer로 시작하지 않을 경우 401에러를 반환한다.
	if (!(authHeader && authHeader.startsWith('Bearer'))) {
		return res.status(401).json(AUTH_ERROR);
	}
	// 3. Authorization 키가 존재 할 경우 토큰을 읽는다.
	const token = authHeader.split(' ')[1];

	// TODO: Make it secure!
	// 4. 토큰을 검증한다.
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
