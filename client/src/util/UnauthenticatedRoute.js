import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// only allows user to pass through route if unauthenticated
const UnauthenticatedRoute = ({ component: Component, authenticated, ...rest }) => (
	<Route {...rest} render={(props) => (authenticated === true ? <Redirect to='/' /> : <Component {...props} />)} />
);

const mapStateToProps = (state) => ({
	authenticated : state.user.authenticated,
});

export default connect(mapStateToProps)(UnauthenticatedRoute);
