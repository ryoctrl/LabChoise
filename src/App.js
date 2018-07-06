import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './Home';
import Result from './Result';
import LabsStatus from './LabsStatus';

const App = () => (
	<BrowserRouter>
		<div>
			<Route exact path="/" component={Home} />
			<Route path="/readonly" component={LabsStatus} />
			<Route path="/result" component={Result} />
		</div>
	</BrowserRouter>
);


export default App;
