const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
//const ActiveDirectory = require('activedirectory');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const methodOverride = require('method-override');
//const FBMessenger = require('fb-messenger');

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

app.set('port', (process.env.PORT) || 80);
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'))
});

