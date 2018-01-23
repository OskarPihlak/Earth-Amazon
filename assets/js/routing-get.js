module.exports = function (app) {

    //npm
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const filter = require('filter-object');
    //files
    const printer_oid_data = require('./oids.js');
    const printer_data_promise = require('./printer-data-promise.js');
    const database = require('./db.js');
    const helpers = require('./helpers.js');
    const pool = database.db_define_database();

    //main page
    app.get('/', function (req, res) {
        console.log('requested main-page');
        printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {
            let sql_statement_get = 'SELECT * FROM inc_supply_status';

            pool.getConnection((err, connection) => {
                connection.query(sql_statement_get, function (error, result, fields) {
                    let floors = helpers.numberOfFloors(response).number_of_floors;
                    let critical_printers = helpers.criticalPrinters(response);
                    for (let i = 0; i < response.length; i++) {
                        response[i].requested = req.params.id;
                    }
                    if (error) throw error;
                    console.log(response);
                    res.render('main', {
                        printers: response,
                        floors: floors,
                        critical_printers: critical_printers
                    });
                    connection.release();
                });
            })
        })
    });

    app.get('/12k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '12'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('twelf-floor', {
                printers_12k: response,
            });
        })
    });

    app.get('/12k', function (req, res) {
        printer_data_promise("WHERE floor = '12'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('twelf-floor', {
                printers_12k: response,
            });
        })
    });

    app.get('/10k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '10'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            console.log(response);
            res.render('tenth-floor', {
                printers_10k: response
            });
        })
    });

    app.get('/10k', function (req, res) {
        printer_data_promise("WHERE floor = '10'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            console.log(JSON.stringify(response));
            res.render('tenth-floor', {
                printers_10k: response
            });
        })
    });

    app.get('/6k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '6'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('sixth-floor', {
                printers_6k: response
            });
        })
    });

    app.get('/6k', function (req, res) {
        printer_data_promise("WHERE floor = '6'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('sixth-floor', {
                printers_6k: response
            });
        })
    });

    app.get('/5k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '5'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fift-floor', {
                printers_5k: response
            });
        })
    });

    app.get('/5k', function (req, res) {
        printer_data_promise("WHERE floor = '5'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fift-floor', {
                printers_5k: response
            });
        })
    });

    app.get('/4k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '4'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fourth-floor', {
                printers_4k: response
            });
        })
    });

    app.get('/4k', function (req, res) {
        printer_data_promise("WHERE floor = '4'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('fourth-floor', {
                printers_4k: response
            });
        })
    });

    app.get('/3k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '3'", pool).then(response => {
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
        printer_data_promise("WHERE floor = '2'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('second-floor', {
                printers_2k: response
            });
        })
    });

    app.get('/2k', function (req, res) {
        printer_data_promise("WHERE floor = '2'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('second-floor', {
                printers_2k: response
            });
        })
    });

    app.get('/1k/:id', function (req, res) {
        printer_data_promise("WHERE floor = '1'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('first-floor', {
                printers_1k: response
            });
        })
    });

    app.get('/1k', function (req, res) {
        printer_data_promise("WHERE floor = '1'", pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render('first-floor', {
                printers_1k: response
            });
        })
    });


    app.get('/admin', function (req, res) {
        let sql_statement_get_snmp_adresses = 'SELECT * FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
        let sql_statement_get_printers_inc_supply = `SELECT * FROM printers_inc_supply.inc_supply_status;`;
        pool.getConnection((err, connection) => {
            let inc_supply = new Promise((resolve, reject) => {
                connection.query(sql_statement_get_printers_inc_supply, function (error, result) {
                    return resolve(result);
                });
            });
            connection.query(sql_statement_get_snmp_adresses, function (error, result) {
                let number_of_floors = helpers.numberOfFloors(result).number_of_floors;
                if (error) throw error;

                res.render('admin', {
                    printers_all: result,
                    floors: number_of_floors
                });
            });
            connection.release();
        });
    });

    app.get('/floors', function (req, res) {
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_get, function (error, result) {
                let number_of_floors = helpers.numberOfFloors(result).number_of_floors;
                if (error) throw error;

                res.render('floors', {
                    floors: number_of_floors
                });
            });
            connection.release();
        });
    });


    app.get('/storage', function (req, res) {
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.inc_supply_status;';
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_get, function (error, sql_data) {
                let toner_storage = helpers.arrayToObjectArray(helpers.uniqueCartridges(sql_data).unique_array);
                let sorted_storage = helpers.printerStorageSorting(toner_storage, sql_data);
                if (error) {
                    throw error;
                }
                console.log(sorted_storage);
                res.render('storage', {
                    storage: sorted_storage
                });
            });
            connection.release();
        });
    });

    app.get('/storage/:id', function (req, res) {
        let selected_storage = req.params.id;
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.inc_supply_status;';
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_get, function (error, sql_data) {
                if (error) {
                    throw error
                }
                let sorted_storage = helpers.storageSorting(sql_data, selected_storage);
                res.render('storage', {
                    storage: sorted_storage
                });
            });
            connection.release();
        });
    });
    app.get('/precentage/cartridge', function (req, res) {


        /*       connection.query(sql_statmenet_get_target_statistics, function (error, result, fields) {
                   let ultimate_master_array = [];
                   for(let a = 0; a< result.length; a++){
                       let element_array = [];
                       for(let b = 0; b < unique_printer_name_array.length; b++){
                           //every printer has its own set of cartridges. no need to compare them to all cartridges.



                           for(let c = 0; c < unique_cartridge_name_array.length; c++){
                               if(result[a].printer_name === unique_printer_name_array[b] && result[a].cartridge === unique_cartridge_name_array[c] ){
                                   //console.log(result[a],unique_printer_name_array[b],unique_cartridge_name_array[c])
                                   //console.log(result[a]);
                                   element_array.push(result[a]);
                               }

                           }
                       }
                       ultimate_master_array.push(element_array);
                   }
                   console.log(ultimate_master_array);
               });*/

        //add together last 7day data

        let statistics = [];
        res.render('cartridge-statistics', {
            statistics: statistics
        })
    });


    pool.getConnection((err, connection) => {
        let sql_statmenet_get_target_statistics = 'SELECT * FROM printers_inc_supply.printer_cartridge_statistics;';
        Array.prototype.unique = function () {
            let arr = [];
            for (let i = 0; i < this.length; i++) {
                if (!arr.includes(this[i])) {
                    arr.push(this[i]);
                }
            }
            return arr;
        };
        connection.query(sql_statmenet_get_target_statistics, function (error, result, fields) {
            printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {
                let printer_main = [];
                for (let i = 0; i < response.length; i++) {
                    let cartridge_array = [];
                    if (response[i].color === true) {
                        for (let y = 0; y < 4; y++) { cartridge_array.push(response[i].cartridge[printer_oid_data.colors_loop_info()[y].inc_name].name); }
                            printer_main.push({name: response[i].name, toner: cartridge_array});
                    } else if(response[i].color === false){
                        for (let y = 0; y < 1; y++) { cartridge_array.push(response[i].cartridge[printer_oid_data.colors_loop_info()[y].inc_name].name); }
                        printer_main.push({name: response[i].name, toner: cartridge_array});
                    }
                }
                console.log(printer_main);
                console.log((printer_main[0].toner).length);
                for(let i = 0; i < result.length; i++){
                   // console.log(result[i]);

                    for(let x =0; x < printer_main.length; x++){
                       console.log((printer_main[x].toner).length);

                        for(let z = 0; z < (printer_main[x].toner).length; z++) {
                            console.log(result[i].printer_name === printer_main[x].name );
                            if (result[i].printer_name === printer_main[x].name) {
                                    console.log(result[i].printer_name, result[i].cartridge, result[i].id);
                            }
                        }
                    }
                }


            });
        });

    })
};
