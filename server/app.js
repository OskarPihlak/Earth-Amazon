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
const ip = require('ip');
const minifyHTML = require('express-minify-html');
const printer_data_promise = require('../assets/js/printer-data-promise.js');
const routing_get = require('../assets/js/routing-get.js');
const routing_post = require('../assets/js/routing-post.js');
const routing_delete = require('../assets/js/routing-delete.js');
const helpers = require('../assets/js/helpers');

//app init
const app = express();

app.enable('trust proxy');

app.use(minifyHTML({
    //override:      true,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
    }
}));
console.log(__dirname, '../assets');
app.use(express.static(path.join(__dirname, '../assets')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//templating engine
app.set('../views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Error 500! Something broke!')
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

app.set('port', (process.env.PORT) || 8888);
app.listen(app.get('port'), function () {
    console.log('Local               http://localhost:' + app.get('port')+'/');
    console.log(`On Your Network:    http://${ip.address()}:${app.get('port')}/`);
});

