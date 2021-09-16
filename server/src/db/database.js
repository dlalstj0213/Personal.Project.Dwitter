import Mongoose from 'mongoose';
import { config } from '../config.js';

export function connectDB() {
	return Mongoose.connect(config.db.host, {
		autoCreate: true,
		autoIndex: true,
	});
}

/**
 * _id -> id
 */
export function useVirtualId(schema) {
	// this(해당 스키마)에 가상의 필드에 id를 추가하고, 필드 값은 _id 필드의 값으로 한다.
	schema.virtual('id').get(function () {
		return this._id.toString();
	});
	// json 변환시 가상의 필드도 포함이 될 수 있게 설정
	schema.set('toJSON', { virtuals: true });
	// console에 출력시 가상의 필드도 출력 될 수 있게 설정
	schema.set('toObject', { virtuals: true });
}
