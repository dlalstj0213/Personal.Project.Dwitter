//import HttpClient from '../src/modules/http';

//const httpClient = new HttpClient();

// const query = username ? `?username=${username}` : '';
// httpClient.fetch(`/tweets${query}`, {
// 	method: 'GET',
// });

const text = 'hello this is Test';

const options = {
	method: 'POST',
	headers: { 'Content-Type': 'application/json!!', hh: 'tt' },
	body: JSON.stringify({ text, username: 'minseo', name: 'Minseo' }),
};

const opt = {
	...options,
	headers: {
		'Content-Type': 'application/json',
		...options.headers,
	},
};

console.log(opt);
