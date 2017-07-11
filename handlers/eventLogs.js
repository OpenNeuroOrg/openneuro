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
        c.crn.logs.find({type:{$in: events}}, {"sort" : [['date', 'desc']]}).toArray((err, logs)=> {
            if(err) return next(err);
            res.send(logs);
        });
    }
}

export default handlers;