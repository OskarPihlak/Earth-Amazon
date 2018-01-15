module.exports = function (app) {
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const printer_data_promise = require('./printer-data-promise');
    const database = require('./db.js');
    const helpers = require('./helpers.js');
    const cartridge_add = require('./cartridge-add.js');
    let pool = database.db_define_database();
    //cartridge_add.cartridge_add('192.168.67.47','lolol',true, pool);


    app.post('/admin/update', urlEncodedParser, function (req, res) {
        console.log(req);
        let sql_statement_put = "UPDATE printers_inc_supply.snmpadresses SET ip='" + req.body.printer_ip + "', name='" + req.body.printer_name + "', color=" + req.body.printer_color + ", max_capacity="+ req.body.printer_max_capacity +" WHERE key_name='" + req.body.printer_key_name + "';";
        console.log(sql_statement_put);
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_put, function (error, data) {
                if (error) throw error;
                res.redirect('/admin');
            });
            connection.release();
        });
    });

    app.post('/update/marker/position', urlEncodedParser, function (req, res) {
        console.log(req.body.top);
        console.log(req.body.left);

        let sql_statement_put = "UPDATE printers_inc_supply.snmpadresses SET position_top='" + req.body.top + "', position_left='" + req.body.left + "' WHERE name='" + req.body.name + "';";
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_put, function (error, data) {
                if (error) throw error;
                res.redirect('/' + req.body.floor + '/' + req.body.name);
            });
            connection.release();
        });
    });


    app.post('/admin/printer/add', urlEncodedParser, function (req, res) {
        if(req.body.input_ip_submit !== '' && req.body.input_name_submit !== ''){

            let printer_color_status = req.body.input_color_submit;
            let printer_ip = req.body.input_ip_submit;
            let printer_name = req.body.input_name_submit;

            let sql_snmp_adresses_insert = `INSERT INTO printers_inc_supply.snmpadresses SET ip='${req.body.input_ip_submit}', color=${req.body.input_color_submit}, name='${req.body.input_name_submit}', key_name='${req.body.input_name_submit}__' , max_capacity=${req.body.input_max_capacity_submit}, floor='${req.body.input_floor_submit}k',position_left=400, position_top=400;`;
            let sql_printer_name_floor_insert =`INSERT INTO printers_inc_supply.printer_name_floor SET printer_naming='${req.body.input_name_submit}', floor=${req.body.input_floor_submit};`;

            cartridge_add.cartridge_add(printer_ip, printer_name, printer_color_status, pool);

            pool.getConnection((err,connection)=>{
                connection.query(sql_snmp_adresses_insert, (error, data)=>{
                    if (error) throw error;
                });
                connection.release();
            });

            pool.getConnection((err,connection)=>{
                connection.query(sql_printer_name_floor_insert, (error, data)=>{
                    if (error) throw error;
                });
                connection.release();
            });
            res.redirect('/admin');

        }else{
            res.redirect('/admin');
        }
    });

    app.post('/', urlEncodedParser, function (req, res) {
        let sql_statement_put = "UPDATE printers_inc_supply.inc_supply_status SET cartridge_supply='" + req.body.inc_storage_count + "' WHERE cartridge_name='" + req.body.inc_storage_name + "';";
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_put, function (error, data) {
                console.log(data);
                if (error) throw error;
                res.redirect('/');
            });
            connection.release();
        });
    });
};