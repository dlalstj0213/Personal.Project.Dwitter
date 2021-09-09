import Mongoose from 'mongoose';
import * as userRepository from '../data/auth.js';
import { useVirtualId } from '../db/database.js';

/**
 *  NoSQL 정보의 중복성 > 관계 : 쿼리의 성능을 위해서
 */

const tweetSchema = new Mongoose.Schema(
	{
		text: { type: String, required: true },
		userId: { type: String, required: true },
		name: { type: String, required: true },
		username: { type: String, required: true },
		img_url: String,
	},
	{ timestamps: true } // timestamps: true => 자동으로 createdAt, updatedAt 필드 생성
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model('Tweet', tweetSchema);

export async function getAll() {
	return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username) {
	return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id) {
	return Tweet.findById(id);
}

export async function create(text, userId) {
	return userRepository.findById(userId).then((user) =>
		new Tweet({
			text,
			userId,
			name: user.name,
			username: user.username,
		}).save()
	);
}

export async function update(id, text) {
	return Tweet.findByIdAndUpdate(id, { text }, { new: true });
}

export async function remove(id) {
	return Tweet.findByIdAndDelete(id);
}
