import Mongoose from 'mongoose';
import * as userRepository from './auth.js';
import { useVirtualId } from '../db/database.js';

/**
 *  NoSQL 정보의 중복성 > 관계 : 쿼리의 성능을 위해서
 */

export interface Tweet {
	id?: string;
	text: string;
	userId: string;
	name: string;
	username: string;
	img_url?: string;
}

const tweetSchema = new Mongoose.Schema<Tweet>(
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
const TweetModel = Mongoose.model<Tweet>('Tweet', tweetSchema);

export async function getAll() {
	return TweetModel.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username: string) {
	return TweetModel.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id: string) {
	return TweetModel.findById(id);
}

export async function create(text: string, userId: string) {
	return userRepository
		.findById(userId)
		.then((user: userRepository.User | null) =>
			new TweetModel({
				text,
				userId,
				name: user?.name,
				username: user?.username,
			}).save()
		);
}

export async function update(id: string, text: string) {
	return TweetModel.findByIdAndUpdate(id, { text }, { new: true });
}

export async function remove(id: string) {
	return TweetModel.findByIdAndDelete(id);
}
