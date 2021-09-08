import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweet.js';

export default class TweetController {
	async getTweets(req, res, next) {
		const username = req.query.username;
		const data = await (username
			? tweetRepository.getAllByUserName(username)
			: tweetRepository.getAll());

		res.status(200).json(data);
	}

	async getTweet(req, res, next) {
		const id = req.params.id;
		const tweet = await tweetRepository.getById(id);
		if (tweet) return res.status(200).json(tweet);
		else return res.status(404).json({ message: `Tweet id(${id}) not found` });
	}

	async createTweet(req, res, next) {
		const { text } = req.body;
		const userId = req.userId;
		const tweet = await tweetRepository.create(text, userId);
		res.status(201).json(tweet);
		getSocketIO().emit('tweets-creation', { command: 'created', tweet }); // 새로 만들어진 트윗을 Broadcast를 해준다.
	}

	async updateTweet(req, res, next) {
		const id = req.params.id;
		const text = req.body.text;

		/**
		 * 401 = 로그인이 필요한 서비스인데 로그인이 되지 않았을 때
		 * 403 = 로그인된 사용자이지만 특별한 권한이 없을 때
		 */
		const tweet = await tweetRepository.getById(id);
		if (!tweet) {
			return res.sendStatus(404);
		}
		if (tweet.userId !== req.userId) {
			return res.sendStatus(403);
		}

		const updated = await tweetRepository.update(id, text);
		res.status(200).json(updated);
	}

	async deleteTweet(req, res, next) {
		const id = req.params.id;

		const tweet = await tweetRepository.getById(id);
		if (!tweet) {
			return res.sendStatus(404);
		}
		if (tweet.userId !== req.userId) {
			return res.sendStatus(403);
		}

		await tweetRepository.remove(id);
		res.sendStatus(204);
	}
}
