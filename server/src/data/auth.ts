import Mongoose from 'mongoose';
import { useVirtualId } from '../db/database.js';

export interface User {
	id?: string;
	username: string;
	name: string;
	email: string;
	password: string;
	img_url?: string;
}

const userSchema = new Mongoose.Schema<User>({
	username: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	img_url: String,
});

// 가상의 아이디 생성
useVirtualId(userSchema);
// 모델 생성
const UserModel = Mongoose.model<User>('User', userSchema);

export async function findByUsername(username: string): Promise<User | null> {
	return UserModel.findOne({ username });
}

export async function findById(id: string | undefined): Promise<User | null> {
	return UserModel.findById(id);
}

export async function createUser(user: User): Promise<string> {
	return new UserModel(user).save().then((data) => data.id);
}
