import express from 'express';
import 'express-async-errors';
import path from 'path';
import fs from 'fs';
const router = express.Router();

/*
const tweets = [
  {
    id: string,  // 트윗 아이디
    text: string,  // 트윗 텍스트
    createdAt: Date,  // 트윗 생성 날짜
    name: string,  // 사용자 이름
    username: string,  // 사용자 닉네임 (아이디)
    img_url: string  // 사용자 프로필 파일 사진 URL
  }
];
*/

let tweets = JSON.parse(
	fs.readFileSync(
		path.join(process.cwd(), 'res', 'json', 'sample-tweets.json'),
		'utf8'
	)
).tweets;

for (let item of tweets) {
	item.createdAt = new Date();
}

router
	.get('/', (req, res, next) => {
		const username = req.query.username;
		const data = username
			? tweets.filter((item) => item.username === username)
			: tweets;

		res.status(200).json(data);
	})
	.get('/:id', (req, res, next) => {
		const id = req.params.id;
		const tweet = tweets.find((item) => item.id === id);
		if (tweet) return res.status(200).json(tweet);
		else return res.status(404).json({ message: `Tweet id(${id}) not found` });
	})
	.post('/', (req, res, next) => {
		const { text, name, username } = req.body;
		const tweet = {
			//id: Date.now().toString,
			id: 'a' + (tweets.length + 1),
			text,
			createdAt: new Date(),
			name,
			username,
		};

		tweets = [tweet, ...tweets];
		res.status(201).json(tweet);
	})
	.put('/:id', (req, res, next) => {
		const id = req.params.id;
		const text = req.body.text;
		const tweet = tweets.find((item) => item.id === id);
		if (tweet) {
			tweet.text = text;
			res.status(200).json(tweet);
		} else {
			res.status(404).json({ message: `Tweet id(${id}) not found` });
		}
	})
	.delete('/:id', (req, res, next) => {
		const id = req.params.id;
		tweets = tweets.filter((item) => item.id !== id);
		res.sendStatus(204);
	});

export default router;
