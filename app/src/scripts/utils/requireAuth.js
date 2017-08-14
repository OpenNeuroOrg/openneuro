// dependencies ----------------------------------------------------

import React from 'react';
import userStore from '../user/user.store.js';

// require auth ----------------------------------------------------

var requireAuth = (Component, role) => {
    return class Authenticated extends React.Component {
        static willTransitionTo(transition) {
            role = role ? role : 'user';
            if (!userStore.data.token) { // if not logged in
                transition.redirect('front-page', {});
            } else if (role === 'admin' && (!userStore.data.scitran || !userStore.data.scitran.root)) {
                transition.redirect('front-page', {});
            }
        }
        render () {
            return <Component />;
        }
    };
};

export default requireAuth;