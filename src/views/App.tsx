import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import '../styles/App.css';
import { ApolloClient, ApolloClientOptions, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import OneFlashCard from './OneFlashCard';
import FlashCard from './FlashCard';
import ListFlashCard from './ListFlashCard';

let clientObject: object = {
	uri: process.env.REACT_APP_BACKEND_URL,
	cache: new InMemoryCache(),
};

if (localStorage.getItem('token')) {
	clientObject = Object.assign(clientObject, {
		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
	});
}

const client = new ApolloClient(clientObject as ApolloClientOptions<typeof clientObject>);

function App() {
	return (
			<ApolloProvider client={client}>
				<Routes>
					<Route path='' element={<HomePage />}></Route>
					<Route path='sign-in' element={<SignIn />}></Route>
					<Route path='sign-up' element={<SignUp />}></Route>
					<Route path='flashcard' element={<FlashCard />}>
						<Route path='' element={<ListFlashCard />} />
						<Route path=':id' element={<OneFlashCard />} />
					</Route>
				</Routes>
				<ToastContainer />
			</ApolloProvider>
	);
}

export default App;
