import {redis} from '../redis';
import NR from 'node-resque';
import tasks from './tasks.js';

export default {
    queue: null,
    connect(callback) {
        if (!this.queue) {
            if (!redis) {
                throw 'Redis must be connected to connect a queue.';
            }
            this.queue = new NR.queue({connection: {redis: redis}}, tasks),
            this.queue.connect();
            callback(this.queue);
        } else {
            callback(this.queue);
        }
    }
};
