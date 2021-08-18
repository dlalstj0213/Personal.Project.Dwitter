import {} from 'express-async-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';

const jwtSecretKey = '%lY3gBn%R7NlcR%Wyv26Fl%hC@$Bc$2o';
const jwtExpiresInDays = '2d';
const bcryptSaltRounds = 10;

const createJwtToken = function (id) {
	return jwt.sign({ id }, jwtSecretKey, {
		expiresIn: jwtExpiresInDays,
	});
};

// TODO: 나중에 아래의 코드를 은닉해야한다. (to make secure)
export default class TweetController {
	async signup(req, res, next) {
		const { username, password, name, email, img_url } = req.body;
		const found = await userRepository.findByUsername(username);
		if (found) {
			return res.status(409).json({ message: `${username} already exists` });
		}

		// 사용자 패스워드 해싱
		const hashed = await bcrypt.hash(password, bcryptSaltRounds);
		const userId = await userRepository.createUser({
			username,
			password: hashed,
			name,
			email,
			img_url,
		});
		const token = createJwtToken(userId);
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
		res.status(200).json({ token, username });
	}
}
