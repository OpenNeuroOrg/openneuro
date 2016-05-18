// dependencies ---------------------------------------------------------

import React            from 'react';
import Router           from 'react-router';
import routes           from './routes.jsx';
import RouterContainer  from './utils/router-container';


// intialize router -----------------------------------------------------

let router = Router.create({routes: routes, location: Router.HistoryLocation});

RouterContainer.set(router);

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.getElementById('main'));
});

