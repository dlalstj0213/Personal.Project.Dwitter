import Mongoose from 'mongoose';
import { useVirtualId } from '../db/database.js';

const userSchema = Mongoose.Schema({
	username: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	img_url: String,
});

// 가상의 아이디 생성
useVirtualId(userSchema);
// 모델 생성
const User = Mongoose.model('User', userSchema);

export async function findByUsername(username) {
	return User.findOne({ username });
}

export async function findById(id) {
	return User.findById(id);
}

export async function createUser(user) {
	return new User(user).save().then((data) => data.id);
}
