import path from 'path';
import fs from 'fs';
import * as userRepository from '../data/auth.js';

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
		path.join(process.cwd(), 'res', 'json', 'sample-data.json'),
		'utf8'
	)
).tweets;

for (let item of tweets) {
	item.createdAt = new Date().toString();
}

export async function getAll() {
	// return tweets;
	return Promise.all(
		tweets.map(async (tweet) => {
			const { username, name, img_url } = await userRepository.findById(
				tweet.userId
			);
			return { ...tweet, username, name, img_url };
		})
	);
}

export async function getAllByUserName(username) {
	return getAll().then((tweets) =>
		tweets.filter((item) => item.username === username)
	);
}

export async function getById(id) {
	const found = tweets.find((item) => item.id === id);
	if (!found) {
		return null;
	}
	const { username, name, img_url } = await userRepository.findById(
		found.userId
	);
	return { ...found, username, name, img_url };
}

export async function create(text, userId) {
	const tweet = {
		id: Date.now().toString(),
		text,
		createdAt: new Date().toString(),
		userId,
	};
	tweets = [tweet, ...tweets];
	return getById(tweet.id);
}

export async function update(id, text) {
	const tweet = tweets.find((item) => item.id === id);
	if (tweet) tweet.text = text;
	return getById(tweet.id);
}

export async function remove(id) {
	tweets = tweets.filter((item) => item.id !== id);
}
