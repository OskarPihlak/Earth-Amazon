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
i = 0;

function concatStyle(response, style){
    for(let i= 0; i< response.length; i++){
        if (response[i].name === style[i].name){
            response[i].style = style[i];
            console.log(i);
            console.log(style[i]);
        }
    }
    return response;
}

function requestedPrinterJoinToResponse(response, req){
    for(let i=0; i<response.length; i++){
        response[i].requested = req.params.id;
    }
    return response;
}

//create connection
let db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'printers_inc_supply'
});

db.connect(function (err) {
    if (err) throw err;
    console.log('Mysql connected to printers_inc_supply on 127.0.0.1');
});

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

app.get('/', function (req, res) {
    printer_data_promise("WHERE color = true OR color = false ").then(response =>{
        let sql_statement_get = 'SELECT * FROM inc_supply_status';
        let query = db.query(sql_statement_get, function (error, sql_data) {
            if (error) throw error;

            res.render('main', {
                printers: response
            });
        });
    }).catch(error => {console.log(error)});
});

app.get('/12k/:id', function (req, res) {
    printer_data_promise("WHERE floor = '12k'").then(response => {
        requestedPrinterJoinToResponse(response, req);
        res.render('twelf-floor', {
            printers_12k:response,
        });
    });
});

app.get('/10k/:id', function (req, res) {
    printer_data_promise("WHERE floor = '10k'").then(response => {
        requestedPrinterJoinToResponse(response, req);
        res.render('tenth-floor', {
            printers_10k:response
        });
    });
});

app.get('/6k/:id', function (req, res) {
    printer_data_promise("WHERE floor = '6k'").then(response => {
        requestedPrinterJoinToResponse(response, req);
        res.render('sixth-floor', {
            printers_6k:response
        });
    });
});

app.get('/4k/:id', function (req, res) {
    printer_data_promise("WHERE floor = '4k'").then(response => {
        requestedPrinterJoinToResponse(response, req);
        res.render('fourth-floor', {
            printers_4k:response
        });
    });
});

app.get('/3k/:id', function (req, res) {
    printer_data_promise("WHERE floor = '3k'").then(response => {
        requestedPrinterJoinToResponse(response, req);
        res.render('third-floor', {
            printers_3k: response
        });
    });
});

app.get('/2k/:id', function (req, res) {
    printer_data_promise("WHERE floor = '2k'").then(response => {
        requestedPrinterJoinToResponse(response, req);
        res.render('second-floor', {
            printers_2k: response
        });
    });
});

app.get('/1k/:id', function (req, res) {
    printer_data_promise("WHERE floor = '1k'").then(response => {
        requestedPrinterJoinToResponse(response, req);
        res.render('first-floor', {
            printers_1k: response
        });
    });
});

app.get('/floors', function (req, res) {

    res.render('floor-system', {
        //printer_name: req.params.id
    });
});

app.post('/', urlEncodedParser, function (req, res) {
    let sql_statement_put = "UPDATE printers_inc_supply.inc_supply_status SET cartridge_supply='" + req.body.inc_storage_count + "' WHERE cartridge_name='" + req.body.inc_storage_name + "'";
   // console.log(sql_statement_put);
    let query = db.query(sql_statement_put, function (error, data) {
        if (error) throw error;
        res.redirect('/');
    });
});


process.on('uncaughtException', function (err) {
    console.log(err);
});

app.set('port', (process.env.PORT) || 3000);
app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'))
});
