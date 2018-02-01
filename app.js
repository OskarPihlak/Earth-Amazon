const port = 8888;
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const methodOverride = require('method-override');
const fs = require('fs');
const http = require('http');
const https = require('https');
const spdy = require('spdy');

const printer_data_promise = require('./assets/js/printer-data-promise.js');
const routing_get = require('./assets/js/routing-get.js');
const routing_post = require('./assets/js/routing-post.js');
const routing_delete = require('./assets/js/routing-delete.js');
const helpers = require('./assets/js/helpers');

let config = { url: 'ldap://dc.domain.com',
    baseDN: 'dc=domain,dc=com',
    username: 'username@domain.com',
    password: 'password' };
//let ad = new ActiveDirectory(config);

//app init
let app = express();

app.use(express.static(path.join(__dirname, 'assets')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//templating engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

/*app.get('*', (req, res) => {
    res
        .status(200)
        .json({message: 'ok'})
})*/
helpers.handlebars();
routing_get(app);
routing_post(app);
routing_delete(app);
process.on('uncaughtException', function (err) {
    console.log(err);
});
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

/*const options = {
    key: fs.readFileSync(__dirname + '/ssl/server.key'),
    cert:  fs.readFileSync(__dirname + '/ssl/server.crt')
};
spdy.createServer(options, app).listen(port, (error) => {
        if (error) {
            console.error(error);
            return process.exit(1)
        } else {
            console.log('Listening on port: ' + port + '.')
        }
    });*/
app.set('port', (process.env.PORT) || 8888);
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'))
});
/*

// set up a route to redirect http to https
app.get('*', function(req, res) {
    res.redirect('https://' + req.headers.host + req.url);
*/

    // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
/*    // res.redirect('https://example.com' + req.url);
});*/

// have it listen on 8080


