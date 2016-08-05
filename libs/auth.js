import scitran from './scitran';

/**
 * Authorization
 *
 * Authorization middleware.
 */
let auth = {

    /**
     * User
     *
     * Checks if a request contains an access token
     * for a valid user. Throws an error or calls next
     * function.
     */
    user(req, res, next) {
        scitran.getUserByToken(req.headers.authorization, (err, resp) => {
            if (err || resp.body.code === 400 || resp.body.code === 401) {
                res.status(401).send({error: 'You must have a valid access token.'});
            } else {
                req.user = resp.body._id;
                req.isSuperUser = resp.body.root;
                return next();
            }
        });
    },

    /**
     * Super User
     *
     * Checks if a request contains an access token
     * for a valid superuser. Throws an error or calls next
     * function.
     */
    superuser(req, res, next) {
        scitran.getUserByToken(req.headers.authorization, (err, resp) => {
            if (err || !resp.body.root) {
                res.status(403).send({error: 'You must have admin privileges.'});
            } else {
                req.user = resp.body._id;
                req.isSuperUser = resp.body.root;
                return next();
            }
        });
    },

    /**
     * Optional
     *
     * If a request has a valid access token it will
     * append the user id to the req object. Will
     * not throw an error. Used for requests that may
     * work with varying levels of access.
     */
    optional(req, res, next) {
        scitran.getUserByToken(req.headers.authorization, (err, resp) => {
            if (resp.body && resp.body._id) {
                req.user = resp.body._id;
                req.isSuperUser = resp.body.root;
            }
            return next();
        });
    },

    /**
     * Dataset Access
     *
     * Takes in the authorization header and a datasetId as
     * a url or query param and adds a hasAccess property to
     * the request object.
     */
    datasetAccess(options) {
        options = options ? options : {optional: false};
        return function (req, res, next) {
            let snapshot   = req.query.hasOwnProperty('snapshot') && req.query.snapshot == 'true';
            let datasetId = req.params.datasetId ? req.params.datasetId : req.query.datasetId;
            auth.optional(req, res, () => {
                scitran.getProject(datasetId, (err, resp1) => {
                    if (resp1.body.code && resp1.body.code == 404) {
                        return res.status(404).send({error: resp1.body.detail});
                    }

                    let hasAccess = !!resp1.body.public || req.isSuperUser;
                    if (resp1.body.permissions && !hasAccess) {
                        for (let permission of resp1.body.permissions) {
                            if (permission._id == req.user) {hasAccess = true; break;}
                        }
                    }
                    req.hasAccess = hasAccess;

                    if (!options.optional && !req.hasAccess) {
                        return res.status(403).send({error: 'You do not have access to this dataset.'});
                    }

                    return next();
                }, {snapshot});
            });
        };
    },

    /**
     * Ticket
     *
     * Checks for a valid ticket parameter
     */
    ticket(req, res, next) {
        let ticket   = req.query.ticket;

        if (!ticket) {
            return res.status(400).send({error: 'No download ticket query parameter found.'});
        }

        c.tickets.findOne({_id: ObjectID(ticket)}, {}, (err, result) => {
            if (err || !result) {
                return res.status(401).send({error: 'Download ticket was not found or expired'});
            }
            req.ticket = result;
            return next();
        });
    },

    /**
     * From Origin
     *
     * Takes an origin url and ensures the the request
     * originates from it.
     */
    fromOrigin(origin) {
        return function (req, res, next) {
            console.log(origin);            // https://api.tacc.utexas.edu/
            console.log(req.get('host'));   // localhost:8111
            console.log(req.get('origin')); // http://localhost:9876
            if (false) {
                return res.status(403).send({error: 'This request did not originate from an allowed domain.'});
            }
            next();
        }
    }

};

export default auth;
