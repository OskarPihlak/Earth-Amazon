module.exports = (app) => {
    const bodyParser = require('body-parser');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const database = require('./db.js');
    let pool = database.db_define_database();

    app.post('/admin/printer/delete', urlEncodedParser, function (req, res) {

        console.log(req);

        let sql_snmp_adresses_delete = `DELETE FROM printers_inc_supply.snmpadresses WHERE ip='${req.body.input_ip_delete}' AND name='${req.body.input_name_delete}';`;
        let sql_printer_name_floor_delete =`DELETE FROM printers_inc_supply.printer_name_floor WHERE printer_naming='${req.body.input_name_delete}';`;
        let sql_printer_cartridge_delete = `DELETE FROM printers_inc_supply.inc_supply_status WHERE printer_name='${req.body.input_name_delete}';`;
        //These request require promises

        pool.getConnection((err, connection) => {
            connection.query(sql_snmp_adresses_delete, function (error, data) {
                console.log(data);
                if (error) throw error;
                res.redirect('/');
            });
            connection.release();
        });
        pool.getConnection((err, connection) => {
            connection.query(sql_printer_name_floor_delete, function (error, data) {
                console.log(data);
                if (error) throw error;
                res.redirect('/');
            });
            connection.release();
        });
        pool.getConnection((err, connection) => {
            connection.query(sql_printer_cartridge_delete, function (error, data) {
                console.log(data);
                if (error) throw error;
                res.redirect('/');
            });
            connection.release();
        });
        res.redirect('/admin');
    });
};
