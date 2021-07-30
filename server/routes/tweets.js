import path from 'path';
import express from 'express';
import 'express-async-errors';
console.log(path.join(process.cwd(), 'data', 'tweet.js'));
import TweetController from '../controller/TweetController.js';

const tweetController = new TweetController();
const router = express.Router();

router
	.get('/', tweetController.getTweets)
	.get('/:id', tweetController.getTweet)
	.post('/', tweetController.createTweet)
	.put('/:id', tweetController.updateTweet)
	.delete('/:id', tweetController.deleteTweet);

export default router;
