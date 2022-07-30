import { createSlice } from '@reduxjs/toolkit';

export interface CardType {
	id: number;
	question: string;
	answer: string;
	author: {
		name: string;
	};
	usersRead: [
		{
			user: {
				id: number;
				name: string;
			};
		},
	];
}
export interface CardState {
	data: { cards: [CardType]; count: number } | null;
	error: string | null;
	loadingGet: boolean;
	loadingCreate: boolean;
	loadingUpdate: boolean;
	loadingDelete: boolean;
	loadingRead: boolean;
}

const initialState: CardState = {
	error: null,
	data: null,
	loadingGet: false,
	loadingCreate: false,
	loadingUpdate: false,
	loadingDelete: false,
	loadingRead: false,
};

export const cardSlice = createSlice({
	name: 'card',
	initialState,
	reducers: {
		getCards: (
			state: CardState,
			{ type, payload }: { type: string; payload: CardState['data'] },
		): CardState => {
			return { ...state, loadingGet: false, error: null, data: payload };
		},
		loadingGetCards: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			return { ...state, loadingGet: true };
		},
		createCard: (
			state: CardState,
			{ type, payload }: { type: string; payload: CardType },
		): CardState => {
			return {
				...state,
				loadingCreate: false,
				error: null,
				data: {
					...state.data,
					cards: [...state.data!.cards, payload] as unknown as [CardType],
					count: (state.data as { cards: [CardType]; count: number }).count + 1,
				},
			};
		},
		loadingCreateCard: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			return { ...state, loadingCreate: true };
		},
		updateCard: (
			state: CardState,
			{ type, payload }: { type: string; payload: CardType },
		): CardState => {
			return {
				...state,
				loadingUpdate: false,
				error: null,
				data: {
					...state.data!,
					cards: state.data!.cards.map((card) => {
						if (card.id === (payload as { id: number }).id) {
							return payload;
						}
						return card;
					}) as [CardType],
				},
			};
		},
		loadingUpdateCard: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			return { ...state, loadingUpdate: true };
		},
		deleteCard: (
			state: CardState,
			{ type, payload }: { type: string; payload: number },
		): CardState => {
			return {
				...state,
				loadingDelete: false,
				error: null,
				data: {
					...state.data!,
					cards: state.data!.cards.filter((card) => card.id !== payload) as [CardType],
					count: state.data!.count - 1,
				},
			};
		},
		loadingDeleteCard: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			return { ...state, loadingDelete: true };
		},
		readCard: (
			state: CardState,
			{
				type,
				payload,
			}: { type: string; payload: { id: number; usersRead: CardType['usersRead'] } },
		): CardState => {
			return {
				...state,
				loadingRead: false,
				error: null,
				data: {
					...state.data!,
					cards: state.data!.cards.map((card) => {
						if (card.id === payload.id) {
							return { ...card, usersRead: payload.usersRead };
						}
						return card;
					}) as [CardType],
				},
			};
		},
		loadingReadCard: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			return { ...state, loadingRead: true };
		},
		cardError: (
			state: CardState,
			{ type, payload }: { type: string; payload: string },
		): CardState => {
			return {
				...state,
				loadingGet: false,
				loadingCreate: false,
				loadingUpdate: false,
				loadingRead: false,
				error: payload,
			};
		},
	},
});

export const {
	getCards: getCardsAction,
	loadingGetCards: loadingGetCardsAction,
	cardError: cardErrorAction,
	createCard: createCardAction,
	loadingCreateCard: loadingCreateCardAction,
	updateCard: updateCardAction,
	loadingUpdateCard: loadingUpdateCardAction,
	deleteCard: deleteCardAction,
	loadingDeleteCard: loadingDeleteCardAction,
	readCard: readCardAction,
	loadingReadCard: loadingReadCardAction,
} = cardSlice.actions;
export const cardReducer = cardSlice.reducer;
