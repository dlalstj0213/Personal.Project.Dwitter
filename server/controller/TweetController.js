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
		const { text, name, username } = req.body;
		const tweet = await tweetRepository.create(text, name, username);
		console.log(tweet);
		res.status(201).json(tweet);
	}

	async updateTweet(req, res, next) {
		const id = req.params.id;
		const text = req.body.text;
		const tweet = await tweetRepository.update(id, text);
		if (tweet) {
			res.status(200).json(tweet);
		} else {
			res.status(404).json({ message: `Tweet id(${id}) not found` });
		}
	}

	async deleteTweet(req, res, next) {
		const id = req.params.id;
		await tweetRepository.remove(id);
		res.sendStatus(204);
	}
}
