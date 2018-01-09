module.exports = function(app) {
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const printer_data_promise = require('./printer-data-promise');
    const database = require('./db.js');
    const helpers = require('./helpers.js');
    database.db_connect();


    app.post('/admin/update', urlEncodedParser, function (req, res) {
        console.log(req.body.printer_ip);
        console.log(req.body.printer_name);
        console.log(req.body.printer_key_name);
        let sql_statement_put = "UPDATE printers_inc_supply.snmpadresses SET ip='" + req.body.printer_ip + "', name='" + req.body.printer_name + "' WHERE key_name='" + req.body.printer_key_name + "'";
        console.log(sql_statement_put);
        let query = database.db_create_connection().query(sql_statement_put, function (error, data) {
            if (error) throw error;
            res.redirect('/admin');
        });
    });

    app.post('/update/marker/position', urlEncodedParser, function (req, res) {
        console.log(req.body.top);
        console.log(req.body.left);

        let sql_statement_put = "UPDATE printers_inc_supply.snmpadresses SET position_top='" + req.body.top + "', position_left='" + req.body.left + "' WHERE name='" + req.body.name + "';";
        console.log(sql_statement_put);
        let query = database.db_create_connection().query(sql_statement_put, function (error, data) {
            if (error) throw error;
            res.redirect('/'+req.body.floor+'/'+req.body.name);
        });
    });



    app.post('/admin/add-printer', urlEncodedParser, function (req, res) {
        console.log(req);
        printer_data_promise("WHERE color = true OR color = false ").then(response => {
            res.redirect('/admin');
        });
    });

    app.post('/', urlEncodedParser, function (req, res) {
        console.log(req.body.inc_storage_count);
        let sql_statement_put = "UPDATE printers_inc_supply.inc_supply_status SET cartridge_supply='" + req.body.inc_storage_count + "' WHERE cartridge_name='" + req.body.inc_storage_name + "';";
        let query = database.db_create_connection().query(sql_statement_put, function (error, data) {
            console.log(data);
            if (error) throw error;
            res.redirect('/');
        });
    });

    app.post('/checkbox', urlEncodedParser, function (req, res) {
        console.log(req.body);
        //let sql_statement_put = "UPDATE printers_inc_supply.inc_supply_status SET cartridge_supply='" + req.body.inc_storage_count + "' WHERE cartridge_name='" + req.body.inc_storage_name + "';";
       // let query = database.db_create_connection().query(sql_statement_put, function (error, data) {

            res.redirect('/');
        });
   // });
};