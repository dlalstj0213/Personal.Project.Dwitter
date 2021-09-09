import path from 'path';
import fs from 'fs';
import * as userRepository from '../data/auth.js';
import { getTweets } from '../db/database.js';
import MongoDb from 'mongodb';
const ObjectId = MongoDb.ObjectId;

/**
 *  NoSQL 정보의 중복성 > 관계 : 쿼리의 성능을 위해서
 */

export async function getAll() {
	return getTweets().find().sort({ createdAt: -1 }).toArray().then(mapTweets);
}

export async function getAllByUsername(username) {
	return getTweets()
		.find({ username })
		.sort({ createdAt: -1 })
		.toArray()
		.then(mapTweets);
}

export async function getById(id) {
	return getTweets()
		.find({ _id: new ObjectId(id) })
		.next()
		.then(mapOptionalTweet);
}

export async function create(text, userId) {
	return userRepository
		.findById(userId)
		.then((user) =>
			getTweets().insertOne({
				text,
				createdAt: new Date(),
				userId,
				name: user.name,
				username: user.username,
				img_url: user.img_url,
			})
		)
		.then((result) => getById(result.insertedId.toString()));
}

export async function update(id, text) {
	return getTweets()
		.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: { text } },
			{ returnDocument: 'after' }
		)
		.then((result) => {
			console.log(result);
			return result.value;
		})
		.then(mapOptionalTweet);
}

export async function remove(id) {
	return getTweets().deleteOne({ _id: new ObjectId(id) });
}

function mapTweets(tweets) {
	return tweets.map((tweet) => ({ ...tweet, id: tweet._id.toString() }));
}

// 객체 변환
function mapOptionalTweet(tweet) {
	return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}
