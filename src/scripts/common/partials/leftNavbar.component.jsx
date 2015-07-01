// dependencies ------------------------------------------------------------------

import React from 'react';

import { Link, Navigation } from 'react-router';
// component setup ---------------------------------------------------------------

var LeftNavbar = React.createClass({
// life cycle methods ------------------------------------------------------------

	getInitialState () {
		return {
			toggleNav:'closed',
		}

	},

	render: function() {
		return (
			<span className={this.state.toggleNav}>
				<span className="left-nav-slider">
					<ul><li className="useradmin-upload"><Link to="dashboard"><i className="fa fa-dashboard" /> dashboard</Link></li></ul>
					<span onClick={this._toggleNav}>
					{this.state.toggleNav === 'closed'? 'open »' : 'close «'} </span>
				</span>
			</span>
	    )
	},

// custom methods ----------------------------------------------------------------
	_toggleNav: function(){
		if(this.state.toggleNav === 'closed'){
			this.setState({toggleNav: 'open'});
		}else{
			this.setState({toggleNav: 'closed'});
		}
	}
});



export default LeftNavbar;
