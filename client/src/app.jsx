import { Route, Switch, useHistory } from 'react-router-dom';
import './app.css';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import AllTweets from './pages/AllTweets';
import MyTweets from './pages/MyTweets';

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
			<Switch>
				(
				<>
					<Route exact path="/">
						<AllTweets tweetService={tweetService} />
					</Route>
					<Route exact path="/:username">
						<MyTweets tweetService={tweetService} />
					</Route>
				</>
				)
			</Switch>
		</div>
	);
}

export default App;
