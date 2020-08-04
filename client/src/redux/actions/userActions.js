import db from '../../apis/db';
import {
	SET_USER,
	SET_ERRORS,
	CLEAR_ERRORS,
	LOADING_UI,
	SET_UNAUTHENTICATED,
	LOADING_USER,
	MARK_NOTIFICATIONS_READ,
	LOADING_DATA,
} from './types';

//* User Actions
export const signIn = (formValues, history) => async (dispatch) => {
	dispatch({ type: LOADING_UI });

	try {
		const response = await db.post('/login', {
			email    : formValues.email,
			password : formValues.password,
		});

		const userToken = `Bearer ${response.data.token}`;
		localStorage.setItem('userToken', userToken);
		db.defaults.headers.common['Authorization'] = userToken;

		dispatch(getUserData());
		dispatch({ type: CLEAR_ERRORS });

		history.push('/');
	} catch (error) {
		console.log(error);
		dispatch({
			type    : SET_ERRORS,
			payload : error.response.data,
		});
	}
};

export const signUp = (formValues, history) => async (dispatch) => {
	dispatch({ type: LOADING_UI });

	try {
		const response = await db.post('/signup', {
			email           : formValues.email,
			username        : formValues.username,
			password        : formValues.password,
			confirmPassword : formValues.confirmPassword,
		});

		const userToken = `Bearer ${response.data.token}`;
		localStorage.setItem('userToken', userToken);
		db.defaults.headers.common['Authorization'] = userToken;

		dispatch(getUserData());
		dispatch({ type: CLEAR_ERRORS });

		history.push('/');
	} catch (error) {
		dispatch({
			type    : SET_ERRORS,
			payload : error.response.data,
		});
	}
};

export const getUserData = () => async (dispatch) => {
	dispatch({ type: LOADING_DATA });
	const response = await db.get('/user');

	dispatch({ type: SET_USER, payload: response.data });
};

export const logOut = () => (dispatch) => {
	localStorage.removeItem('userToken');
	delete db.defaults.headers.common['Authorization'];
	dispatch({ type: SET_UNAUTHENTICATED });
};

export const editUserDetails = (userDetails) => async (dispatch) => {
	dispatch({ type: LOADING_USER });

	try {
		await db.post('/user', userDetails);
		dispatch(getUserData());
	} catch (error) {
		console.log(error);
	}
};

export const uploadImage = (formData) => async (dispatch) => {
	dispatch({ type: LOADING_USER });

	try {
		await db.post('/user/image', formData);
		dispatch(getUserData());
	} catch (error) {
		console.log(error);
	}
};

export const markNotificationsRead = (notificationsIds) => async (dispatch) => {
	try {
		await db.post('/notifications', notificationsIds);

		dispatch({
			type : MARK_NOTIFICATIONS_READ,
		});
	} catch (error) {
		console.log(error);
	}
};
