import { configureStore } from '@reduxjs/toolkit';
import { cardReducer } from './reducers/card.reducer';
import { userReducer } from './reducers/user.reducer';

export const store = configureStore({
	reducer: {
		userReducer: userReducer,
		cardReducer: cardReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
