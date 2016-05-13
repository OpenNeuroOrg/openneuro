// dependencies ---------------------------------------------------------

import React            from 'react';
import ReactDOM         from 'react-dom';
import Router           from 'react-router';
import routes           from './routes.jsx';
import RouterContainer  from './utils/router-container';


// intialize router -----------------------------------------------------

let router = Router.create({routes});

RouterContainer.set(router);

router.run(function (Handler) {
    ReactDOM.render(<Handler/>, document.getElementById('main'));
});

