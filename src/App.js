// import logo from './logo.svg';
import './App.less';
import { useState, useEffect } from 'react';
import { Provider } from "react-redux";
import Router from './router/Router';
import store from 'redux/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "./firebase/Config";

// const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
export default function App() {
	useEffect(() => {
	  onAuthStateChanged( auth, (user) => {
	  	console.log(user);
	    // if (user) {
	    //   this.setState({
	    //     authenticated: true,
	    //     loading: false,
	    //   });
	    // } else {
	    //   this.setState({
	    //     authenticated: false,
	    //     loading: false,
	    //   });
	    // }
	  })
	}, [])
	return (
		<Provider store={store}>
		  <Router />
		</Provider>
	);
};