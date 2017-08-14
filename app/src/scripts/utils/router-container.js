/**
 * Router Container
 *
 * A helper utility to circumvent circular
 * dependency issues when using the router
 * in a flux store.
 */

var _router = null;

export default {

    set (router) {

        _router = router;

        this.makePath = (to, params, query) => {
            return router.makePath(to, params, query);
        };

        this.makeHref = (to, params, query) => {
            return router.makeHref(to, params, query);
        };

        this.transitionTo = (to, params, query) => {
            router.transitionTo(to, params, query);
        };

        this.replaceWith = (to, params, query) => {
            router.replaceWith(to, params, query);
        };

        this.goBack = () => {
            router.goBack();
        };

        this.run = (render) => {
            router.run(render);
        };
    },

    get: () => _router

};