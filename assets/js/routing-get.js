module.exports = function (app) {

    //npm
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const filter = require('filter-object');
    const moment = require('moment');
    const jQuery = require('jquery');
    //files
    const printer_oid_data = require('./oids.js');
    const printer_data_promise = require('./printer-data-promise.js');
    const database = require('./db.js');
    const helpers = require('./helpers.js');
    const pool = database.db_define_database();

    if (!Array.prototype.last){
        Array.prototype.last = function(){
            return this[this.length - 1];
        };
    }

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
                    let last_dates = [];
                    for(let i = 0 ; i < 7 ; i ++){
                        last_dates.push(moment(date_filter.setDate(dayOfMonth - i)).format('DD-MM-YYYY'))
                    }
                    let master_printer_data = [];
                    for (let x = 0; x < unique_printers_and_toners.length; x++) { //iterates every printer

                        let unified = [];
                        unified.printer = {};
                        unified.value = [];

                        let printer_statistics_data = {};
                        printer_statistics_data.printer_name = '';
                        printer_statistics_data.info = [];

                        for (let i = 0; i < result.length; i++) { //iterates every result in statistics database

                            for (let z = 0; z < (unique_printers_and_toners[x].toner).length; z++) { //iterates every toner of  iteratable printer

                                if (result[i].cartridge === unique_printers_and_toners[x].toner[z] && result[i].printer_name === unique_printers_and_toners[x].name) {

                                    unified.printer = result[i].printer_name;
                                    switch (result[i].color) {
                                        case 'black':
                                            unified.value.push({ date: moment(result[i].date).format('DD-MM-YYYY'), black: result[i].precentage, toner_black:result[i].cartridge });
                                            break;
                                        case 'cyan':
                                            unified.value.push({ date: moment(result[i].date).format('DD-MM-YYYY'), cyan: result[i].precentage, toner_cyan:result[i].cartridge });
                                            break;
                                        case 'yellow':
                                            unified.value.push({ date: moment(result[i].date).format('DD-MM-YYYY'),  yellow: result[i].precentage, toner_yellow:result[i].cartridge });
                                            break;
                                        case 'magenta':
                                            unified.value.push({ date: moment(result[i].date).format('DD-MM-YYYY'),  magenta: result[i].precentage, toner_magenta:result[i].cartridge });
                                            break;
                                    }
                                    printer_statistics_data.printer_name = result[i].printer_name;
                                }
                            }
                        }

                        //get dates of last 7 days
                        let printer_data = [];
                        printer_data.value = [];
                        printer_data.printer = '';
                        for (let x = 0; x < last_dates.length; x++) { //iterate last 7 day dates
                            let day_toners = [];

                            for (let i = 0; i < unified.value.length; i++) { //cartridge objects in array
                                if (unified.value[i].date === last_dates[x]) {
                                    day_toners.push(unified.value[i]);
                                }
                            }
                            let temporary_toner_object = {};
                            for (let i = 0; i < day_toners.length; i++) {
                                Object.assign(temporary_toner_object, day_toners[i]);
                            }

                            if (helpers.isEmpty(temporary_toner_object) === false) {
                                //console.log(temporary_toner_object);
                                printer_data.value.push(temporary_toner_object);
                            }
                        }
                        printer_data.printer = unified.printer;
                        master_printer_data.push(printer_data);
                    }
                    let sql_statement_get = 'SELECT name,color,floor FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
                    pool.getConnection((err, connection) => {
                        connection.query(sql_statement_get, function (error, sql_data) {
                            for (let i = 0; i < master_printer_data.length; i++) {
                                for (let x = 0; x < sql_data.length; x++) {
                                    if (master_printer_data[i].printer === sql_data[x].name) {
                                        master_printer_data[i].color = !!sql_data[x].color;
                                        master_printer_data[i].value.reverse();
                                    }
                                }
                            }
                            for(let i = 0; i < master_printer_data.length; i++){
                                master_printer_data[i].usage = [];
                                console.log('');
                                if(master_printer_data[i].color === true) {
                                    master_printer_data[i].usage.push({toner:master_printer_data[i].value[0].toner_black, used_per_day: (master_printer_data[i].value[0].black - (master_printer_data[i].value).last().black) / master_printer_data[i].value.length});
                                    master_printer_data[i].usage.push({toner:master_printer_data[i].value[0].toner_cyan, used_per_day: (master_printer_data[i].value[0].cyan - (master_printer_data[i].value).last().cyan) / master_printer_data[i].value.length});
                                    master_printer_data[i].usage.push({toner:master_printer_data[i].value[0].toner_yellow, used_per_day:(master_printer_data[i].value[0].yellow - (master_printer_data[i].value).last().yellow) / master_printer_data[i].value.length});
                                    master_printer_data[i].usage.push({toner:master_printer_data[i].value[0].toner_magenta, used_per_day:(master_printer_data[i].value[0].magenta - (master_printer_data[i].value).last().magenta) / master_printer_data[i].value.length});
                                } else if(master_printer_data[i].color === false){
                                    master_printer_data[i].usage.push({toner:master_printer_data[i].value[0].toner_black, used_per_day: (master_printer_data[i].value[0].black - (master_printer_data[i].value).last().black) / master_printer_data[i].value.length});
                                }
                            }
                            res.render('cartridge-statistics', {
                                chart: master_printer_data
                            })
                        });
                    });
                });
            });
        });
    });
};
