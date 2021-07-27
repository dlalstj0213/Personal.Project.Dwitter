export default class AuthService {
	async login(username, password) {
		return {
			username: 'minseo',
			token: 'abc1234',
		};
	}

	async me() {
		return {
			username: 'minseo',
			token: 'abc1234',
		};
	}

	async logout() {
		return;
	}

	async signup(username, password, name, email, img_url) {
		return {
			username: 'minseo',
			token: 'abc1234',
		};
	}
}
