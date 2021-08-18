import path from 'path';
import fs from 'fs';

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
	item.createdAt = new Date();
}

export async function getAll() {
	return tweets;
}

export async function getAllByUserName(username) {
	return tweets.filter((item) => item.username === username);
}

export async function getById(id) {
	return tweets.find((item) => item.id === id);
}

export async function create(text, name, username) {
	const tweet = {
		//id: Date.now().toString,
		id: 'a' + (tweets.length + 1),
		text,
		createdAt: new Date(),
		name,
		username,
	};

	tweets = [tweet, ...tweets];
	return tweet;
}

export async function update(id, text) {
	const tweet = tweets.find((item) => item.id === id);
	if (tweet) tweet.text = text;
	return tweet;
}

export async function remove(id) {
	tweets = tweets.filter((item) => item.id !== id);
}
