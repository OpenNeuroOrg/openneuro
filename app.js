// dependencies ----------------------------------------------------

import express    from 'express';
import config     from './config';
import routes     from './routes';
import bodyParser from 'body-parser';

// configuration ---------------------------------------------------

let app = express();

app.use((req, res, next) => {
    res.set(config.headers);
    res.type('application/json');
    next();
});
app.use(bodyParser.json());

let router = express.Router();
routes(router);
app.use('/', router);

// start server ----------------------------------------------------

app.listen(config.port, () => {
	console.log('Server is listening on port ' + config.port);
});