module.exports = function (app) {
    //npm
    const bodyParser = require('body-parser');
    const mysql = require('mysql');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const filter = require('filter-object');
    const moment = require('moment-business-days');
    const ping = require('ping');
    const fs = require('fs');
    const colors = require('colors');
    const moment_range = require('moment-range');
    const moment_ranges = moment_range.extendMoment(moment);
    //files
    const printer_data_promise = require('./printer-data-promise.js');
    const chart = require('./chart.js');
    const database = require('./db.js');
    const helpers = require('./helpers.js');
    const pool = database.db_define_database();
    //helper: array last element
    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
    }
    //helper:  only keepunique array values
    Array.prototype.unique = function () {
        let arr = [];
        for (let i = 0; i < this.length; i++) {
            if (!arr.includes(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; };

    //main page
    app.get('/', function (req, res) {
        console.log('Route -> /');
        printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {
            let floors = helpers.numberOfFloors(response).number_of_floors;

            for (let i = 0; i < response.length; i++) {
                response[i].requested = req.params.id;
            }

              let critical_printers = response => {
                  let critical_printers = [];
                  for (let i = 1; i < response.length; i++){
                      if (response[i].hasOwnProperty('cartridge')){

                      let toner = response[i].cartridge;
                      let critical_toner_level = 12;
                      console.log((response[i].color));
                        if (response[i].color) {
                          if (toner.black.value < critical_toner_level ||
                              toner.cyan.value < critical_toner_level ||
                              toner.magenta.value < critical_toner_level ||
                              toner.yellow.value < critical_toner_level) {
                              response[i].cartridge.critical = true;
                              critical_printers.push(response[i]);
                          }
                        } else if (response[i].color === false && toner.black.value < critical_toner_level) {
                             response[i].cartridge.critical = true;
                          critical_printers.push(response[i]);
                         } else {
                            response[i].cartridge.critical = false;
                         }
                      }
                 }
                  return critical_printers;
              };
              let critically_printers = critical_printers(response);
            res.render('main', {
                printers: response,
                floors: floors,
                critical_printers: critically_printers
            });
        });
    });

    //use 0 and 2nd params
    app.get(/^\/floor\/(?:([^\/]+?))(\/(?:([^\/]+?)))?$/gi, (req, res) => {
        console.log(req.params);
        let floor_number = req.params[0].replace(/k/g,'');
        printer_data_promise(`WHERE floor = '${floor_number}'`, pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            console.log(response);
            res.render(`${floor_number}-floor`, {
                floor_printers: response
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
                if (error) throw error;

                //array of printer ip-s
                let hosts = [];
                for (let i = 0; i < result.length; i++) {
                    hosts.push(result[i].ip)
                }

                //creates promises
                function ipStatus(ip) {
                    return new Promise(resolve => {
                        ping.sys.probe(ip, isAlive => {
                            let msg = isAlive ? {ip: ip, alive: true} : {ip: ip, alive: false};
                            return resolve(msg);
                        })
                    });
                }

                //handles ip promises and renders page
                async function adminRender(array) {
                    let array_of_ips = [];
                    for (const item of array) {
                        await ipStatus(item).then(data => array_of_ips.push(data));
                    }

                    //add promise result to matching query element
                    let final_data = [];
                    array_of_ips.forEach(status_object => {
                        result.forEach(query_result => {
                            if (status_object.ip === query_result.ip) {
                                query_result.printer_ping = status_object;
                                final_data.push(query_result);
                            }
                        });
                    });
                    let number_of_floors = helpers.numberOfFloors(final_data).number_of_floors;
                    await res.render('admin', {
                        printers_all: final_data,
                        floors: number_of_floors
                    });
                    return result;
                }

                adminRender(hosts);
            });
            connection.release();
        });
    });

    app.get('/floors', function (req, res) {
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_get, function (error, result) {
                let floors_master = [];
                result.forEach(data => {
                    data.printer_ping = {alive: true};
                    floors_master.push(data)
                });
                let number_of_floors = helpers.numberOfFloors(floors_master).number_of_floors;
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


    let chart_master;
    const range = moment_ranges.range(8, 10);
    chart().then(data => chart_master = data);
    setInterval(() => {
        let date = new Date();
        let day_name = moment().format('dddd');
        if (range.contains(date.getHours()) && (day_name !== 'Saturday' || day_name !== 'Sunday')) {
            chart().then(data => chart_master = data);
        }
    }, 2700000);
    app.get('/precentage/cartridge', function (req, res) {

        res.render('cartridge-statistics', {
            chart: chart_master
        });
    });


    //TODO get this fixed
    app.get('/details/:name/:ip', (req, res) => {
        let query = `WHERE  name = "${req.params.name}" AND ip= "${req.params.ip}"`;
        console.log(query);
        printer_data_promise(query, pool).then(response => {

            res.render('detailed-printer-report', {
                chart: chart_master,
                data: response

            })
        });
    });

    //get file
    app.get('/email', (req, res) => {
        console.log('Route -> /');
        printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {

            let critical_printers = response => {
                let critical_printers = [];
                for (let i = 1; i < response.length; i++) {
                    if (response[i].hasOwnProperty('cartridge')) {

                        let toner = response[i].cartridge;
                        let critical_toner_level = 12;

                        if (response[i].color) {
                            if (toner.black.value < critical_toner_level || toner.cyan.value < critical_toner_level || toner.magenta.value < critical_toner_level || toner.yellow.value < critical_toner_level) {
                                response[i].cartridge.critical = true;
                                critical_printers.push(response[i]);
                            }
                        } else if (response[i].color === false && toner.black.value < critical_toner_level) {
                            if (response[i].ip === '192.168.67.42' || '192.168.67.3') {
                                response[i].cartridge.critical = false;
                            }
                            else {
                                response[i].cartridge.critical = true;
                                critical_printers.push(response[i]);
                            }
                        } else {
                            response[i].cartridge.critical = false;
                        }
                    }
                }
                return critical_printers;
            };
            critical_printers(response);

            let critical_toner = [];
            response.forEach(response => {
                if (response.name !== 'RequestTimedOutError' && response.cartridge.critical === true) {
                    critical_toner.push(response);
                }
            });
            let all_is_good = false;
            if (critical_toner.length === 0) all_is_good = true;

            res.render('email', {
                printers: critical_toner,
                date: moment().format('DD-MM-YYYY'),
                all_is_good: all_is_good
            });
        });
    });
};
