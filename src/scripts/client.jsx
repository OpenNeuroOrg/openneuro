// dependencies ---------------------------------------------------------

import React            from 'react';
import ReactDOM         from 'react-dom';
import Router           from 'react-router';
import routes           from './routes.jsx';
import RouterContainer  from './utils/router-container';

//Google analytics
import ReactGA          from 'react-ga';
ReactGA.initialize('UA-100754266-1');

// Router.HistoryLocation.listen((location)=> {
//     ReactGA.ga('send', 'pageview', location.pathname);
// });

console.log(Router.HistoryLocation);
// intialize router -----------------------------------------------------

let router = Router.create({routes: routes, location: Router.HistoryLocation});

RouterContainer.set(router);

Router.run(routes, Router.HistoryLocation, function (Handler) {
    ReactDOM.render(<Handler/>, document.getElementById('main'));
});

