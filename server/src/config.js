import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
	const value = process.env[key] || defaultValue;
	if (value == null) {
		throw new Error(`Key ${key} is undefined`);
	}
	return value;
}

export const config = {
	port: parseInt(required('PORT', 8080)),
	cors: {
		allowOrigin: required('CORS_ALLOW_ORIGIN'),
	},
	jwt: {
		secretKey: required('JWT_SECRET'),
		expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
	},
	bcrypt: {
		saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 10)),
	},
	db: {
		host: required('DB_HOST'),
	},
	csrf: {
		plainToken: required('CSRF_SECRET_KEY'),
	},
	rateLimit: {
		windowMs: 60000, // 1 minute
		maxRequest: 100, // 100 max requests
	},
};