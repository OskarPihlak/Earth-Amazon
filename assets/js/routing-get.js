module.export = (app) =>{
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
        res.render('first-floor', {
            printer_data:[{name:''}]
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

};