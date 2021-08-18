import path from 'path';
import fs from 'fs';

// abcd1234 : $2b$10$p0QGo0SCPf04HkP17OxA.OsQH1COyfnhICqzqLTrcWJA1zwyDRhNG

let users = JSON.parse(
	fs.readFileSync(
		path.join(process.cwd(), 'res', 'json', 'sample-data.json'),
		'utf8'
	)
).users;

export async function findByUsername(username) {
	return users.find((user) => user.username === username);
}

export async function createUser(user) {
	const created = { ...user, id: Date.now().toString() };
	users.push(created);
	return created.id;
}
