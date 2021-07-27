import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AuthService from './service/auth';
import TweetService from './service/tweet';

const baseURL = process.env.REACT_APP_BASE_URL;
const authService = new AuthService();
const tweetService = new TweetService(baseURL);

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter></BrowserRouter>
		<App tweetService={tweetService} />
	</React.StrictMode>,
	document.getElementById('root')
);
