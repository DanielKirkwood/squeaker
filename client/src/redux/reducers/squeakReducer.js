import {
	SET_SQUEAKS,
	LOADING_DATA,
	POST_SQUEAK,
	SET_SQUEAK,
	LIKE_SQUEAK,
	UNLIKE_SQUEAK,
	SUBMIT_COMMENT,
	DELETE_SQUEAK,
} from '../actions/types';

const initialState = {
	squeaks : [],
	squeak  : {},
	loading : false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case LOADING_DATA:
			return {
				...state,
				loading : true,
			};
		case SET_SQUEAKS:
			return {
				...state,
				squeaks : action.payload,
				loading : false,
			};
		case SET_SQUEAK:
			return {
				...state,
				squeak : action.payload,
			};
		case POST_SQUEAK:
			return {
				...state,
				squeaks : [ action.payload, ...state.squeaks ],
			};
		case LIKE_SQUEAK:
		case UNLIKE_SQUEAK:
			let index = state.squeaks.findIndex((squeak) => squeak.squeakId === action.payload.squeakId);

			state.squeaks[index] = action.payload;

			if (state.squeak.squeakId === action.payload.squeakId) {
				state.squeak.likeCount = action.payload.likeCount;
			}
			return {
				...state,
			};
		case SUBMIT_COMMENT:
			let commentedOnIndex = state.squeaks.findIndex((squeak) => squeak.squeakId === action.payload.squeakId);
			return {
				...state,
				squeak  : {
					...state.squeak,
					comments     : [ action.payload, ...state.squeak.comments ],
					commentCount : state.squeak.commentCount + 1,
				},
				squeaks : state.squeaks.map(
					(squeak, squeaksArrIndex) =>
						squeaksArrIndex === commentedOnIndex
							? { ...squeak, commentCount: squeak.commentCount + 1 }
							: squeak
				),
			};
		case DELETE_SQUEAK:
			let i = state.squeaks.findIndex((squeak) => squeak.squeakId === action.payload);
			state.squeaks.splice(i, 1);
			return {
				...state,
			};

		default:
			return state;
	}
};
