import express from 'express';
import 'express-async-errors';
import { body, param } from 'express-validator';
import TweetController from '../controller/TweetController.js';
import { validate } from '../middleware/validator.js';

const tweetController = new TweetController();
const router = express.Router();

// validation
// sanitization
const validateTweet = [
	body('text')
		.trim()
		.notEmpty()
		.withMessage('트윗 내용이 없습니다.')
		.isLength({ min: 2 })
		.withMessage('트윗 내용은 3글자 이상 입력해야합니다.'),
	body('name').trim().notEmpty().withMessage('이름은 필수입니다.'),
	body('username').trim().notEmpty().withMessage('유저이름은 필수입니다.'),
	validate,
];

router
	.get('/', tweetController.getTweets)
	.get('/:id', tweetController.getTweet)
	.post('/', validateTweet, tweetController.createTweet)
	.put('/:id', validateTweet, tweetController.updateTweet)
	.delete(
		'/:id',
		[param('id').notEmpty().withMessage('삭제할 아이디가 없습니다.'), validate],
		tweetController.deleteTweet
	);

export default router;
