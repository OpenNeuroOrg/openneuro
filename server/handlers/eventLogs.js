import mongo    from '../libs/mongo';
import config from '../config';

let c = mongo.collections;
let events = Object.keys(config.events);
// handlers ----------------------------------------------------------------

/**
 * Event Logs
 *
 * Handlers for event logs.
 */
let handlers = {
    getEventLogs (req, res, next) {
        // This stuff could be a middleware?
        let limit = 30;
        let skip = 0;
        let reqLimit = parseInt(req.query.limit);
        let reqSkip = parseInt(req.query.skip);
        if (!isNaN(reqLimit) && reqLimit < limit) {
            limit = req.query.limit;
        }
        if (!isNaN(reqSkip) && reqSkip) {
            skip = reqSkip;
        }
        c.crn.logs.find({type:{$in: events}},
            {
                sort : [['date', 'desc']],
                limit: limit,
                skip: skip
            }).toArray((err, logs) => {
                if(err) return next(err);
                res.send(logs);
            });
    }
};

export default handlers;