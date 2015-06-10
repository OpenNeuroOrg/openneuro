// dependencies ---------------------------------------------------------

import React  from 'react';
import Router from 'react-router';
import routes from './routes.jsx';


// intialize routes -----------------------------------------------------

Router.run(routes, function (Handler) {
	React.render(<Handler/>, document.getElementById('main'));
});

