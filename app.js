const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const snmp = require("net-snmp");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const printer_data = require('./assets/js/printer-data.js');

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


printer_data((error, data)=> {
    app.get('/', function (req, res) {
        let sql_statement_get = 'SELECT * FROM inc_supply_status';
        let query = db.query(sql_statement_get, function (error, sql_data) {
            let result = {};
            for (let i=0; i<sql_data.length; i++) {
                let color_name_array = sql_data[i].cartridge_name;
                let color_named = color_name_array.split(" ");
                let color_name = color_named[0];
                result[sql_data[i].printer_name +  '_' + color_name + '-supplies'] = {id:sql_data[i].id, supply:sql_data[i].cartridge_supply, cartridge_class: sql_data[i].cartridge_name};
            }
        res.render('main', {
            printers:data,
            inc_supply:result
            });
        });
    });
    app.post('/', urlEncodedParser, function(req, res){

         let sql_statement_put = "'UPDATE printers_inc_supply.inc_supply_status (cartridge_supply) SET cartridge_supply='+ req.body.inc_storage_count +' WHERE printer_name='"+ req.body.inc_storage_title +"' AND cartridge_name='"+ req.body.inc_storage_name +"'";
         let query = db.query(sql_statement_put, function (error, data) {
            console.log(req.body);
            if (error) throw error;
             res.render('main', {
                 printers:data,
                 inc_supply:result
             });
        });
        /*
        console.log('backend count  '+ req.body.inc_storage_count);
        console.log('backend name  '+ req.body.inc_storage_name);
        console.log('backend title  '+ req.body.inc_storage_title);
        console.log('UPDATE printers_inc_supply.inc_supply_status (cartridge_supply) SET SET cartridge_supply='+ req.body.inc_storage_count +' WHERE printer_name="'+req.body.inc_storage_title+'" AND cartridge_name="'+ req.body.inc_storage_name+'"');*/
    });
});








app.set('port', (process.env.PORT) || 3000);
app.listen(app.get('port'),  function () {
    console.log('Server started on port' + app.get('port'))
});