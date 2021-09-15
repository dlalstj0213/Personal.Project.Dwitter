import express from 'express';
import 'express-async-errors';
import { body, param } from 'express-validator';
import AuthController from '../controller/AuthController.js';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

const authController = new AuthController();
const router = express.Router();

const validateCredential = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('username cannot be nothing')
		.isLength({ min: 5 })
		.withMessage('username should be at least 5 characters'),
	body('password')
		.trim()
		.notEmpty()
		.withMessage('password cannot be nothing')
		.isLength({ min: 5 })
		.withMessage('password should be at least 5 characters'),
	validate,
];

const validateSignup = [
	...validateCredential,
	body('name').notEmpty().withMessage('name is missing'),
	body('email').isEmail().normalizeEmail().withMessage('invalid email'),
	body('img_url').isURL().withMessage('invalid URL').optional({
		// img_url은 필수 요소가 아니기 때문에 추가
		nullable: true, // 데이터가 없다면 데이터가 없다는 것으로 간주 후 받아옴,
		checkFalsy: true, // 데이터가 텅텅 빈 문자열이라면 데이터가 없는 것으로 간주 후 받아옴
	}),
	validate,
];

router
	.post('/auth/login', validateCredential, authController.login)
	.post('/auth/signup', validateSignup, authController.signup)
	.post('/auth/logout', authController.logout)
	.get('/auth/me', isAuth, authController.me)
	.get('/auth/csrf-token', authController.csrfToken);

// export default router;
export { router };
