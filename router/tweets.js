import express from 'express';
import path from 'path';
import fs from 'fs';
const router = express.Router();

/*
const tweetsList = [
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

let tweetsList = JSON.parse(
	fs.readFileSync(
		path.join(process.cwd(), 'res', 'json', 'sample-tweets.json'),
		'utf8'
	)
).tweets;

for (let item of tweetsList) {
	item.createdAt = new Date();
}

router
	.get('/', (req, res, next) => {
		const username = req.query.username;
		if (username === '') return res.status(204).send('No Content');
		if (!username) return res.status(200).json(tweetsList);
		res
			.status(200)
			.json(tweetsList.filter((item) => item.username === username));
	})
	.get('/:id', (req, res, next) => {
		const id = req.params.id;
		if (id === '') return res.status(204).send('No Content');
		if (!id) return res.status(200).json(tweetsList);

		const sendJson = tweetsList.filter((item) => item.id === id);

		if (sendJson.length === 0) return res.status(204).send('No Content');
		res.status(200).json(sendJson);
	})
	.post('/', (req, res, next) => {
		let newData = req.body;

		// TO-DO : 유효성 검사
		//

		newData.createdAt = new Date();
		newData.id = 'a' + (tweetsList.length + 1);
		newData.img_url = '';

		tweetsList.push(newData);

		res.status(201).send('Created');
	})
	.put('/:id', (req, res, next) => {
		const id = req.params.id;
		let chgData = req.body;

		tweetsList.map((item) => {
			if (item.id === id) {
				item.text = chgData.text;
				item.createdAt = new Date();
			}
			//return true;
		});

		res.status(200).send('Updated!');
	})
	.delete('/:id', (req, res, next) => {
		const id = req.params.id;

		tweetsList.map((item) => {
			return item.id === id ? false : true;
		});

		res.status(204).send('Deleted!');
	});

export default router;
