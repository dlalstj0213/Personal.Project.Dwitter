import MongoDb from 'mongodb';
import { config } from '../config.js';

let db;
export function connectDB() {
	// 아래의 옵션은 4.X.X 버젼에서는 더이상 지원되지 않는 옵션이다. 새로운 옵션을 보고 싶다면 공식 문서를 참고하자
	// const options = {
	//   useNewUrlParse: true,
	//   useUndifiedTopology: true, // 새로운 버전이 업데이트 되어도 사용하지 않겠다는 옵션
	// }
	// return MongoDb.MongoClient.connect(config.db.host, options);
	return MongoDb.MongoClient.connect(config.db.host).then((client) => {
		db = client.db();
		return db;
	});
}

export function getUsers() {
	return db.collection('users');
}

export function getTweets() {
	return db.collection('tweets');
}
