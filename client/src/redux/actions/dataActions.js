import db from '../../apis/db';
import {
	SET_ERRORS,
	CLEAR_ERRORS,
	LOADING_UI,
	LOADING_USER,
	POST_SQUEAK,
	LOADING_DATA,
	SET_SQUEAKS,
	LIKE_SQUEAK,
	UNLIKE_SQUEAK,
	SUBMIT_COMMENT,
	DELETE_SQUEAK,
	SET_SQUEAK,
	STOP_LOADING_UI,
} from './types';

//* Data Actions
export const fetchSqueaks = () => async (dispatch) => {
	dispatch({ type: LOADING_DATA });

	try {
		const response = await db.get('/squeaks');
		dispatch({ type: SET_SQUEAKS, payload: response.data });
	} catch (error) {
		dispatch({
			type    : SET_SQUEAKS,
			payload : [],
		});
	}
};

export const getSqueak = (squeakId) => async (dispatch) => {
	dispatch({ type: LOADING_UI });
	try {
		const response = await db.get(`/squeak/${squeakId}`);
		dispatch({ type: SET_SQUEAK, payload: response.data });
		dispatch({ type: STOP_LOADING_UI });
	} catch (error) {
		console.log(error);
	}
};

export const postSqueak = (newSqueak) => async (dispatch) => {
	dispatch({ type: LOADING_USER });

	try {
		const response = await db.post('/squeak', newSqueak);
		dispatch({ type: POST_SQUEAK, payload: response.data.resSqueak });
		dispatch(clearErrors());
	} catch (error) {
		dispatch({
			type    : SET_ERRORS,
			payload : error.response,
		});
	}
};

export const likeSqueak = (squeakId) => async (dispatch) => {
	try {
		const response = await db.get(`/squeak/${squeakId}/like`);
		dispatch({
			type    : LIKE_SQUEAK,
			payload : response.data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const unlikeSqueak = (squeakId) => async (dispatch) => {
	try {
		const response = await db.get(`/squeak/${squeakId}/unlike`);
		dispatch({
			type    : UNLIKE_SQUEAK,
			payload : response.data,
		});
	} catch (error) {
		console.log(error);
	}
};

export const submitComment = (squeakId, commentData) => async (dispatch) => {
	try {
		const response = await db.post(`/squeak/${squeakId}/comment`, commentData);

		dispatch({ type: SUBMIT_COMMENT, payload: response.data });
		dispatch({ type: CLEAR_ERRORS });
	} catch (error) {
		dispatch({ type: SET_ERRORS, payload: error.response.data });
	}
};

export const deleteSqueak = (squeakId) => async (dispatch) => {
	try {
		await db.delete(`/squeak/${squeakId}`);
		dispatch({ type: DELETE_SQUEAK, payload: squeakId });
	} catch (error) {
		console.log(error);
	}
};

export const getUserData = (username) => async (dispatch) => {
	dispatch({ type: LOADING_USER });
	try {
		const response = await db.get(`/user/${username}`);
		dispatch({ type: SET_SQUEAKS, payload: response.data.squeaks });
	} catch (error) {
		dispatch({ type: SET_SQUEAKS, payload: null });
	}
};

export const clearErrors = () => (dispatch) => {
	dispatch({ type: CLEAR_ERRORS });
};
