import { useHistory } from 'react-router-dom';
import './app.css';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';

function App({ tweetService }) {
	const history = useHistory();
	const { user, logout } = useAuth();

	const onAllTweets = () => {
		history.push('/');
	};

	const onMyTweets = () => {
		history.push(`/${user.username}`);
	};

	const onLogout = () => {
		if (window.confirm('Do you want to log out?')) {
			logout();
			history.push('/');
		}
	};

	return (
		<div className="app">
			<Header
				username="minseo"
				onLogout={onLogout}
				onAllTweets={onAllTweets}
				onMyTweets={onMyTweets}
			/>
		</div>
	);
}

export default App;
