module.exports = function(app) {
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const printer_data_promise = require('./printer-data-promise');

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

    function requestedPrinterJoinToResponse(response, req){
        for(let i=0; i<response.length; i++){
            response[i].requested = req.params.id;
        }
        return response;
    }

    app.get('/', function (req, res) {
        printer_data_promise("WHERE color = true OR color = false ").then(response => {
            let sql_statement_get = 'SELECT * FROM printers_inc_supply.inc_supply_status;';
            let query = db.query(sql_statement_get, function (error, sql_data) {
                requestedPrinterJoinToResponse(response, sql_data);
                if (error) throw error;

                res.render('main', {
                    printers: response
                });
            });
        }).catch(error => {
            console.log(error)
        });
    });

    app.get('/12k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '12k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('twelf-floor', {
                printers_12k: response,
            });
        });
    });

    app.get('/12k', function (req, res) {
        printer_data_promise("WHERE floor = '12k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('twelf-floor', {
                printers_12k: response,
            });
        });
    });

    app.get('/10k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '10k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('tenth-floor', {
                printers_10k: response
            });
        });
    });

    app.get('/10k', function (req, res) {
        printer_data_promise("WHERE floor = '10k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('tenth-floor', {
                printers_10k: response
            });
        });
    });

    app.get('/6k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '6k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('sixth-floor', {
                printers_6k: response
            });
        });
    });

    app.get('/6k', function (req, res) {
        printer_data_promise("WHERE floor = '6k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('sixth-floor', {
                printers_6k: response
            });
        });
    });

    app.get('/5k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '5k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('fift-floor', {
                printers_5k: response
            });
        });
    });

    app.get('/5k', function (req, res) {
        printer_data_promise("WHERE floor = '5k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('fift-floor', {
                printers_5k: response
            });
        });
    });

    app.get('/4k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '4k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('fourth-floor', {
                printers_4k: response
            });
        });
    });

    app.get('/4k', function (req, res) {
        printer_data_promise("WHERE floor = '4k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('fourth-floor', {
                printers_4k: response
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

    app.get('/3k', function (req, res) {
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

    app.get('/2k', function (req, res) {
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

    app.get('/1k', function (req, res) {
        printer_data_promise("WHERE floor = '1k'").then(response => {
            requestedPrinterJoinToResponse(response, req);
            res.render('first-floor', {
                printers_1k: response
            });
        });
    });

    app.get('/admin', function (req, res) {
        printer_data_promise("WHERE color = true OR color = false ").then(response => {
            res.render('admin', {
                printers_all: response
            });
        });
    });
};