import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// only allowes user to pass through route if authenticated
const AuthenticatedRoute = ({ component: Component, authenticated, ...rest }) => (
	<Route {...rest} render={(props) => (authenticated !== true ? <Redirect to='/' /> : <Component {...props} />)} />
);

const mapStateToProps = (state) => ({
	authenticated : state.user.authenticated,
});

export default connect(mapStateToProps)(AuthenticatedRoute);
