const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const snmp = require("net-snmp");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Handlebars = require('handlebars');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const printer_data_promise = require('./assets/js/printer-data-promise.js');
const routing_get = require('./assets/js/routing-get.js');
const routing_post = require('./assets/js/routing-post.js');
i = 0;
//create connection


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


Handlebars.registerHelper('ifEquals', function(a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('testHelper', function(property) {
    return 'foo: ' + Ember.get(this, property);
});

routing_get(app);
routing_post(app);
process.on('uncaughtException', function (err) {
    console.log(err);
});

app.set('port', (process.env.PORT) || 3000);
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'))
});
