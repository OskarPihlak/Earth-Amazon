const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const snmp = require("net-snmp");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const printer_data = require('./assets/js/printer-data.js');
const printer_data_promise = require('./assets/js/printer-data-promise.js');

printer_data_promise((data)=>{
    console.log(data);
});


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


app.get('/', function (req, res) {
   // printer_data((error, data) => {
        //console.log(data);
        let sql_statement_get = 'SELECT * FROM inc_supply_status';
        let query = db.query(sql_statement_get, function (error, sql_data) {
            let result = {};
            for (let i = 0; i < sql_data.length; i++) {
                let color_name_array = sql_data[i].cartridge_name;
                let color_named = color_name_array.split(" ");
                let color_name = color_named[0];
                result[sql_data[i].printer_name + '_' + color_name + '_supplies'] = {
                    id: sql_data[i].id,
                    supply: sql_data[i].cartridge_supply,
                    cartridge_class: sql_data[i].cartridge_name
                };
            }
            if (error) throw error;
            //console.log('res.render/////////////////////////////////////////////////////////////////////////////////');
            res.render('main', {
                printers: 'rewriting',
                inc_supply: result
            });
           // console.log(result);
        });

    //});

    app.post('/', urlEncodedParser, function (req, res) {

        let sql_statement_put = "UPDATE printers_inc_supply.inc_supply_status SET cartridge_supply='" + req.body.inc_storage_count + "' WHERE cartridge_name='" + req.body.inc_storage_name + "'";
       // console.log(sql_statement_put);
        let query = db.query(sql_statement_put, function (error, data) {
            if (error) throw error;
            res.redirect('/');
        });
    });
});

app.set('port', (process.env.PORT) || 3001);
app.listen(app.get('port'), function () {
    console.log('Server started on port' + app.get('port'))
});