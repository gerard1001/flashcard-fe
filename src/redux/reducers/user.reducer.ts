import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
	data: object;
	error: string | null;
	loadingGet: boolean;
}

const initialState: UserState = {
	error: null,
	data: {},
	loadingGet: true,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		getUser: (
			state: UserState,
			{ type, payload }: { type: string; payload: object },
		): UserState => {
			return { ...state, loadingGet: false, error: null, data: payload };
		},
		loadingGetUser: (
			state: UserState,
			{ type, payload }: { type: string; payload: object },
		): UserState => {
			return { ...state, loadingGet: true, data: {} };
		},
		userError: (
			state: UserState,
			{ type, payload }: { type: string; payload: string },
		): UserState => {
			return { ...state, loadingGet: false, error: payload };
		},
	},
});

export const {
	getUser: getUserAction,
	loadingGetUser: loadingGetUserAction,
	userError: userErrorAction,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
