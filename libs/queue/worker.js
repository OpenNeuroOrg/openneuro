import os from 'os';
import mongo from '../mongo';
import redis from '../redis';
import config from '../../config';
import NR from 'node-resque';
import tasks from './tasks';

mongo.connect();

redis.connect(config.redis, (redis) => {
    let workerConfig = {
        connection: {redis: redis},
        looping: true,
        timeout: 5000,
        queues: ['*'],
        name: os.hostname() + ':' + process.pid
    };

    let worker = new NR.worker(workerConfig, tasks);

    worker.connect(() => {
        worker.workerCleanup();
        worker.start();
    });
});
