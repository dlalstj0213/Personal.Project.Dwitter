import express from 'express';
import 'express-async-errors';
import { body, param, query, validationResult } from 'express-validator';
import TweetController from '../controller/TweetController.js';

const tweetController = new TweetController();
const router = express.Router();

const validate = (req, res, next) => {
	const errors = validationResult(req);
	console.log(errors);
	if (errors.isEmpty()) {
		return next();
	}
	return res.status(400).json({ message: errors.array()[0].msg });
};

router
	.get('/', tweetController.getTweets)
	.get('/:id', tweetController.getTweet)
	.post(
		'/',
		[
			body('text').trim().notEmpty().withMessage('트윗 내용이 없습니다.'),
			body('name').trim().notEmpty().withMessage('이름은 필수입니다.'),
			body('username').trim().notEmpty().withMessage('유저이름은 필수입니다.'),
			validate,
		],
		tweetController.createTweet
	)
	.put(
		'/:id',
		[
			param('id').notEmpty().withMessage('변경할 아이디가 없습니다.'),
			body('text').notEmpty().withMessage('변경할 내용이 없습니다.'),
			validate,
		],
		tweetController.updateTweet
	)
	.delete(
		'/:id',
		[param('id').notEmpty().withMessage('삭제할 아이디가 없습니다.'), validate],
		tweetController.deleteTweet
	);

export default router;
