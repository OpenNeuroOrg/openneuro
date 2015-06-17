// dependencies ---------------------------------------------------------

import React           from 'react';
import Router          from 'react-router';
import routes          from './routes.jsx';
import RouterContainer from './utils/router-container';

// intialize router -----------------------------------------------------

var router = Router.create({routes});

RouterContainer.set(router);

router.run(function (Handler) {
	React.render(<Handler/>, document.getElementById('main'));
});

