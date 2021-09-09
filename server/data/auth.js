import MongoDb from 'mongodb';
import { getUsers } from '../db/database.js';

const ObjectId = MongoDb.ObjectId;
export async function findByUsername(username) {
	return getUsers().find({ username }).next().then(mapOptionalUser);
}

export async function findById(id) {
	return getUsers()
		.find({ _id: new ObjectId(id) })
		.next()
		.then(mapOptionalUser);
}

export async function createUser(user) {
	return getUsers()
		.insertOne(user)
		.then((result) => {
			//console.log('Created', result.insertedId.toString());
			return result.insertedId.toString(); // Id 반환
		});
}

// 객체 변환
function mapOptionalUser(user) {
	return user ? { ...user, id: user._id.toString() } : user;
}
