module.exports = function (app) {

    //npm
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const filter = require('filter-object');
    const moment = require('moment');
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
                    let unique_printers_and_toners = [];
                    for (let i = 0; i < response.length; i++) {
                        let cartridge_array = [];
                        if (response[i].color === true) {
                            for (let y = 0; y < 4; y++) {
                                cartridge_array.push(response[i].cartridge[printer_oid_data.colors_loop_info()[y].inc_name].name);
                            }
                            unique_printers_and_toners.push({name: response[i].name, toner: cartridge_array});
                        } else if (response[i].color === false) {
                            for (let y = 0; y < 1; y++) {
                                cartridge_array.push(response[i].cartridge[printer_oid_data.colors_loop_info()[y].inc_name].name);
                            }
                            unique_printers_and_toners.push({name: response[i].name, toner: cartridge_array});
                        }
                    }

                    let date_filter = new Date();
                    let dayOfMonth = date_filter.getDate();
                    date_filter.setDate(dayOfMonth - 7);
                    let holder_of_statistics = [];
                    for (let x = 0; x < unique_printers_and_toners.length; x++) {

                        let printer_statistics_data = {};
                        printer_statistics_data.printer_name = '';
                        printer_statistics_data.info = [];
                        let black = [];
                        black.toner_name = '';
                        black.toner = [];
                        let cyan = [];
                        cyan.toner_name = '';
                        cyan.toner = [];
                        let yellow = [];
                        yellow.toner_name = '';
                        yellow.toner = [];
                        let magenta = [];
                        magenta.toner_name = '';
                        magenta.toner = [];
                        for (let i = 0; i < result.length; i++) { //this is only 1 cartridge

                            for (let z = 0; z < (unique_printers_and_toners[x].toner).length; z++) {

                                if (result[i].cartridge === unique_printers_and_toners[x].toner[z] && result[i].printer_name === unique_printers_and_toners[x].name) {
                                    // console.log(result[i], unique_printers_and_toners[x].toner[z] );
                                    switch (result[i].color) {
                                        case 'black':
                                            black.toner_name = result[i].cartridge;
                                            black.toner.push({
                                                precentage: result[i].precentage,
                                                date: moment(result[i].date).format('DD-MM-YYYY'),
                                                color: result[i].color
                                            });
                                            break;
                                        case 'cyan':
                                            cyan.toner_name = result[i].cartridge;
                                            cyan.toner.push({
                                                precentage: result[i].precentage,
                                                date: moment(result[i].date).format('DD-MM-YYYY'),
                                                color: result[i].color
                                            });
                                            break;
                                        case 'yellow':
                                            yellow.toner_name = result[i].cartridge;
                                            yellow.toner.push({
                                                precentage: result[i].precentage,
                                                date: moment(result[i].date).format('DD-MM-YYYY'),
                                                color: result[i].color
                                            });
                                            break;
                                        case 'magenta':
                                            magenta.toner_name = result[i].cartridge;
                                            magenta.toner.push({
                                                precentage: result[i].precentage,
                                                date: moment(result[i].date).format('DD-MM-YYYY'),
                                                color: result[i].color
                                            });
                                            break;
                                    }
                                    printer_statistics_data.printer_name = result[i].printer_name;
                                }
                            }
                        }
                        if (typeof black.toner !== 'undefined' && black.toner.length > 0) {
                            printer_statistics_data.info.push(black);
                        }
                        if (typeof cyan.toner !== 'undefined' && cyan.toner.length > 0) {
                            printer_statistics_data.info.push(cyan);
                        }
                        if (typeof yellow.toner !== 'undefined' && yellow.toner.length > 0) {
                            printer_statistics_data.info.push(yellow);
                        }
                        if (typeof magenta.toner !== 'undefined' && magenta.toner.length > 0) {
                            printer_statistics_data.info.push(magenta);
                        }

                        if (typeof printer_statistics_data.info !== 'undefined' && printer_statistics_data.info.length > 0) {

                            for (let i = 0; i < printer_statistics_data.info.length; i++) {
                                let difference_in_inc = {};
                                difference_in_inc.name = '';
                                difference_in_inc.cartridge = '';
                                difference_in_inc.value = [];
                                difference_in_inc.usage = '';
                                for (let x = 0; x < printer_statistics_data.info[i].toner.length; x++) {  //iterates only once !!!!?!?!?!?!?
                                    console.log('');
                                    if (moment(date_filter).format('DD-MM-YYYY') < printer_statistics_data.info[i].toner[x].date) {  //last 7 days
                                        difference_in_inc.name = printer_statistics_data.printer_name;
                                        difference_in_inc.cartridge = printer_statistics_data.info[i].toner_name;
                                        difference_in_inc.value.push(printer_statistics_data.info[i].toner[x]);
                                    }
                                }
                               // console.log(printer_statistics_data.info[i]);
                                 let toner_usage_per_day = -(difference_in_inc.value[0].precentage - difference_in_inc.value[difference_in_inc.value.length - 1].precentage) / difference_in_inc.value.length;
                                difference_in_inc.usage = toner_usage_per_day;
                                console.log(difference_in_inc);
                                holder_of_statistics.push(difference_in_inc);
                            }
                        }
                    }
                    let master_of_statistics = holder_of_statistics.unique();

                    let sql_statement_get = 'SELECT name,floor FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
                    pool.getConnection((err, connection) => {
                        return connection.query(sql_statement_get, function (error, sql_data) {
                            if (error) {
                                throw error
                            }
                            let unique_printer_name_array = [];
                            for (let i = 0; i < sql_data.length; i++) {
                                unique_printer_name_array.push(sql_data[i].name);
                            }
                            let unique_printer_names = unique_printer_name_array.unique();

                            let formatted_chart_data_array = [];
                            for(let i = 0; i < unique_printer_names.length; i++){
                                let formatted_chart_object = {};

                                for(let x = 0; x < master_of_statistics.length; x++){
                                    if(unique_printer_names[i] === master_of_statistics[x].name){
                                        formatted_chart_object.name = master_of_statistics[x].name;

                                        for(let z = 0; z < master_of_statistics[x].value.length; z++) {
                                            formatted_chart_object.date = master_of_statistics[x].value[z].date;
                                             formatted_chart_object[master_of_statistics[x].value[z].color] = master_of_statistics[x].value[z].precentage;
                                        }
                                    }
                                }
                                formatted_chart_data_array.push(formatted_chart_object);
                            }
                            console.log(formatted_chart_data_array);
                            res.render('cartridge-statistics', {
                                statistics: master_of_statistics,
                                unique_printer_names: unique_printer_names,
                                chart: formatted_chart_data_array
                            })
                        });
                    });
                });
            });
        });
    });
};
