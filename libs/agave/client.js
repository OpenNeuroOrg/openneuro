/*eslint no-console: ["error", { allow: ["log"] }] */

import request from '../request';
import fs     from 'fs';
import config from '../../config';

let clientConfig;

// attempt to import client config file
try {
    clientConfig = require('../../client.config');
} catch (err) {
    // create if it's doesn't exist
    fs.openSync('client.config.js', 'w');
}

// rebuild contents if empty or clientName no
// longer matches configured clientName
if (
    !clientConfig                                  ||
    !clientConfig.hasOwnProperty('name')           ||
    !clientConfig.hasOwnProperty('description')    ||
    !clientConfig.hasOwnProperty('consumerKey')    ||
    !clientConfig.hasOwnProperty('consumerSecret') ||
    clientConfig.name !== config.agave.clientName
) {
    clientConfig = {
        name:           config.agave.clientName,
        description:    config.agave.clientDescription,
        consumerKey:    config.agave.consumerKey,
        consumerSecret: config.agave.consumerSecret
    };
    fs.writeFileSync('client.config.js', 'export default ' + JSON.stringify(clientConfig, null, 2));
}

/**
 * Client Config
 *
 * Strategy for managing the AGAVE client and
 * associated credentials
 */
let client = {

    config: clientConfig,

    recreate(callback) {
        console.log('Recreating AGAVE Client');
        request.post(config.agave.url + 'clients/v2', {
            headers: {
                Authorization: 'Basic ' + new Buffer(config.agave.username + ':' + config.agave.password).toString('base64')
            },
            body: {
                clientName:  config.agave.clientName,
                description: config.agave.clientDescription
            }
        }, (err, res) => {
            if (res.body.status == 'error') {
                console.log('Error Creating AGAVE Client');
                console.log(res.body.message);
            } else {
                // set config changes and save
                client.config.name              =  config.agave.clientName;
                client.config.clientDescription = config.agave.clientDescription;
                client.config.consumerKey       = res.body.result.consumerKey;
                client.config.consumerSecret    = res.body.result.consumerSecret;
                fs.writeFileSync('client.config.js', 'export default ' + JSON.stringify(client.config, null, 4));
                callback();
            }
        });
    }
};

export default client;