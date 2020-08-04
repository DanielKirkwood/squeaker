import {
	SET_USER,
	SET_AUTHENTICATED,
	SET_UNAUTHENTICATED,
	LOADING_USER,
	LIKE_SQUEAK,
	UNLIKE_SQUEAK,
	MARK_NOTIFICATIONS_READ,
} from '../actions/types';

const initialState = {
	authenticated : false,
	loading       : false,
	credentials   : {},
	likes         : [],
	notifications : [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_AUTHENTICATED:
			return {
				...state,
				authenticated : true,
			};
		case SET_UNAUTHENTICATED:
			return initialState;
		case SET_USER:
			return {
				authenticated : true,
				loading       : false,
				...action.payload,
			};
		case LOADING_USER:
			return {
				...state,
				loading : true,
			};
		case LIKE_SQUEAK:
			return {
				...state,
				likes : [
					...state.likes,
					{
						username : state.credentials.username,
						squeakId : action.payload.squeakId,
					},
				],
			};
		case UNLIKE_SQUEAK:
			return {
				...state,
				likes : state.likes.filter((like) => like.squeakId !== action.payload.squeakId),
			};

		case MARK_NOTIFICATIONS_READ:
			return {
				...state,
				notifications : state.notifications.map((notification) => {
					return { ...notification, read: true };
				}),
			};

		default:
			return state;
	}
};
