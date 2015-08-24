// dependencies ------------------------------------------------------------------
import React     from 'react';

export default class Happybrowser extends React.Component {

// life cycle methods ------------------------------------------------------------
	constructor () {
		this.state = {
			hbVisable: true,
		};
	}
	

	render () {
		return (

				<div className={this.state.hbVisable ? "hbMarkup" : "hbMarkup hidden"}>
					<div className="hb-wrap clearfix">
						
						<div className="hb-text clearfix">
							<img src="./assets/warning.jpg" alt="warning" /> 
							<p>We have detected that your browser does not work with this technology. This site may not work as expected. <strong><a href="http://www.google.com/chrome/">Please consider using Chrome as your browser</a>.</strong></p>
						</div>
						<div className="hb-upgrade clearfix">
							<div className="hb-img-wrap hb-dismiss" id="dismiss" onClick={this._dismiss.bind(this)}>
									X
							</div>
							<div className="hb-img-wrap hb-chrome">
								<a href="http://www.google.com/chrome/" ><img src="./assets/chrome.jpg" alt="upgrade chrome"/></a>
							</div>
						</div>


					</div>    
				</div>
		)
	}
	

	_dismiss () {
		let self = this;
		self.setState({hbVisable: false});
	}
}

