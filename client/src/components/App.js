// react
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//redux
import { store } from '../redux/store';
import { SET_AUTHENTICATED } from '../redux/actions/types';
import { logOut, getUserData } from '../redux/actions/userActions';

// util
import jwtDecode from 'jwt-decode';
import db from '../apis/db';

import AuthenticatedRoute from '../util/AuthenticatedRoute';
import UnauthenticatedRoute from '../util/UnauthenticatedRoute';

// components
import Header from './navbar/Header';
import HomeFeed from './HomeFeed';
import Profile from './user/Profile';
import Login from './forms/Login';
import Signup from './forms/Signup';
import User from './user/User';

// semantic ui
import { Container } from 'semantic-ui-react';

const token = localStorage.userToken;
if (token) {
	const decodedToken = jwtDecode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		store.dispatch(logOut());
		window.location.href = '/login';
	} else {
		store.dispatch({ type: SET_AUTHENTICATED });
		db.defaults.headers.common['Authorization'] = token;
		store.dispatch(getUserData());
	}
}

class App extends Component {
	render() {
		return (
			<Container>
				<Router>
					<Fragment>
						<Header />
						<Switch>
							<Route path='/' exact component={HomeFeed} />
							<AuthenticatedRoute path='/profile' exact component={Profile} />
							<UnauthenticatedRoute path='/login' exact component={Login} />
							<UnauthenticatedRoute path='/signup' exact component={Signup} />
							<Route exact path='/users/:username' component={User} />
							<Route exact path='/users/:username/squeak/:squeakId' component={User} />
						</Switch>
					</Fragment>
				</Router>
			</Container>
		);
	}
}

export default App;
