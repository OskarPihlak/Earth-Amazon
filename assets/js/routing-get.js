module.exports = function (app) {
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const printer_data_promise = require('./printer-data-promise');
    const database = require('./db.js');
    const helpers = require('./helpers.js');
    let pool = database.db_define_database();

    app.get('/', function (req, res) {
        console.log('requested main-page');
        printer_data_promise("WHERE ip IS NOT NULL", pool).then(response => {

            let sql_statement_get = 'SELECT * FROM inc_supply_status';
            pool.getConnection((err, connection) => {
                connection.query(sql_statement_get, function (error, result, fields) {

                    //helpers.requestedPrinterJoinToResponse(response,sql_data);
                    for (let i = 0; i < response.length; i++) {
                        response[i].requested = req.params.id;
                    }
                    let floors = helpers.numberOfFloors(response).number_of_floors;
                    if (error) throw error;

                    console.log(floors);
                    res.render('main', {
                        printers: response,
                        floors: floors
                    });
                    connection.release();
                });
            })
        })
    });

    app.get('/12k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '12k'",pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('twelf-floor', {
                printers_12k: response,
            });
        })
    });

    app.get('/12k', function (req, res) {
        printer_data_promise("WHERE floor = '12k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('twelf-floor', {
                printers_12k: response,
            });
        })
    });

    app.get('/10k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '10k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            console.log(response);
            res.render('tenth-floor', {
                printers_10k: response
            });
        })
    });

    app.get('/10k', function (req, res) {
        printer_data_promise("WHERE floor = '10k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            console.log(JSON.stringify(response));
            res.render('tenth-floor', {
                printers_10k: response
            });
        })
    });

    app.get('/6k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '6k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('sixth-floor', {
                printers_6k: response
            });
        })
    });

    app.get('/6k', function (req, res) {
        printer_data_promise("WHERE floor = '6k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('sixth-floor', {
                printers_6k: response
            });
        })
    });

    app.get('/5k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '5k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fift-floor', {
                printers_5k: response
            });
        })
    });

    app.get('/5k', function (req, res) {
        printer_data_promise("WHERE floor = '5k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fift-floor', {
                printers_5k: response
            });
        })
    });

    app.get('/4k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '4k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fourth-floor', {
                printers_4k: response
            });
        })
    });

    app.get('/4k', function (req, res) {
        printer_data_promise("WHERE floor = '4k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fourth-floor', {
                printers_4k: response
            });
        })
    });

    app.get('/3k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '3k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('third-floor', {
                printers_3k: response
            });
        })
    });

    app.get('/3k', function (req, res) {
        printer_data_promise("WHERE floor = '3k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('third-floor', {
                printers_3k: response
            });
        })
    });

    app.get('/2k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '2k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('second-floor', {
                printers_2k: response
            });
        })
    });

    app.get('/2k', function (req, res) {
        printer_data_promise("WHERE floor = '2k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('second-floor', {
                printers_2k: response
            });
        })
    });

    app.get('/1k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '1k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('first-floor', {
                printers_1k: response
            });
        })
    });

    app.get('/1k', function (req, res) {
        printer_data_promise("WHERE floor = '1k'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('first-floor', {
                printers_1k: response
            });
        })
    });


    app.get('/admin', function (req, res) {
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.snmpadresses;';
        pool.getConnection((err, connection) => {
            console.log(pool);
            connection.query(sql_statement_get, function (error, result) {

                if (error) throw error;
                res.render('admin', {
                    printers_all: result
                });
            });
            connection.release();
        });
    });

    app.get('/floors', function (req, res) {
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.printer_name_floor;';

        pool.getConnection((err, connection) => {

            connection.query(sql_statement_get, function (error, sql_data) {
                let number_of_floors = helpers.numberOfFloors(sql_data).number_of_floors;
                if (error) throw error;

                res.render('floors', {
                    floors: number_of_floors
                });
            });
            connection.release();
        });
    });
};

