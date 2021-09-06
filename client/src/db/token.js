const TOKEN = 'token';

// Local Storage 말고 보안적으로 좀 더 안전하게 토큰을 저장할 수 있는 방법이 없을까?
export default class TokenStorage {
	saveToken(token) {
		localStorage.setItem(TOKEN, token);
	}

	getToken() {
		return localStorage.getItem(TOKEN);
	}

	clearToken() {
		localStorage.clear(TOKEN);
	}
}
