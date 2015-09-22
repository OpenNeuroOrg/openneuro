// dependencies ----------------------------------------------------

import express    from 'express';
import config     from './config';
import routes     from './routes';
import bodyParser from 'body-parser';
import morgan     from 'morgan';

// configuration ---------------------------------------------------

let app = express();

app.use((req, res, next) => {
    res.set(config.headers);
    res.type('application/json');
    next();
});
app.use(morgan('short'));
app.use(bodyParser.json());

// routing ---------------------------------------------------------

app.use('/api/v1/', routes);

// error handling --------------------------------------------------

app.use(function(err, req, res, next) {
    res.header('Content-Type', 'application/json');
    var send = {'error' : ''};
    var http_code = (typeof err.http_code === 'undefined') ? 500 : err.http_code;
    if (typeof err.message !== 'undefined' && err.message !== '') {
        send.error = err.message;
    } else {
        if(err.http_code == 400){
            send.error = "there was something wrong with that request";
        }else if(err.http_code == 401){
            send.error = "you are not authorized to do that";
        }else if(err.http_code == 404){
            send.error = "that resource was not found";
        }else{
            send.error = "there was a problem";
        }
    }
    res.status(http_code).send(send);
});

// start server ----------------------------------------------------

app.listen(config.port, () => {
	console.log('Server is listening on port ' + config.port);
});