// dependencies --------------------------------------------------------------

import React          from 'react';
import {RouteHandler} from 'react-router';
import Navbar         from './partials/navbar.component.jsx';
import Actions        from '../user/user.actions.js';
import mixin          from 'es6-react-mixins';

// component setup -----------------------------------------------------------

class App extends React.Component {

// life cycle methods --------------------------------------------------------

	componentDidMount () {
		Actions.initOAuth();
	}

	render () {
		return (
			<div className="page">
				<Navbar />
				<RouteHandler />
			</div>
		)				
	}
}

export default App;
