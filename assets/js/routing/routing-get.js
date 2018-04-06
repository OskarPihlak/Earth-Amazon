module.exports = function (app) {

    //npm
    const moment = require('moment-business-days');
    const colors = require('colors');
    const moment_range = require('moment-range');
    const moment_ranges = moment_range.extendMoment(moment);
    //files
    const printer_data_promise = require('../oid-proccessing/printer-data-promise.js');
    const chart = require('../chart.js');
    const database = require('../db/db.js');
    const helpers = require('../helpers.js');
    const pool = database.db_define_database();
    //
    let printer_result;
    let master;
    const range_chart = moment_ranges.range(8, 10);
    const range_printer = moment_ranges.range(9, 16);

    printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool)
        .then(response => {
            chart(response).then(data => {
                    master = data;
                    master.floors = data.floors;
                    master.locations = data.locations;

                    console.log(colors.red('data'));
                    console.log(data);
                    console.log(colors.red('dawdawdata'));

                   /* app.get('/json', (req,res) =>{
                        res.send(
                            {
                                data: data,
                                floors:data.floors,
                                locations:data.location
                            }
                        );
                    });*/
                });
            printer_result = response;
        });

    app.get('/', function (req, res) {
        console.log(colors.magenta('Navigating to main page -> /'));
        console.log(`printer master is  -> ${master} <-`);

        res.render('./navbar/main', {
            printers: master,
            floors: master.floors,
            locations: master.locations,
            month: moment().format('MMMM')
        });
    });

    //use 0 and 2nd params, this displays printer location on map
    app.get(/^\/(?:([^\/]+?))\/floor\/(?:([^\/]+?))(\/(?:([^\/]+?)))?$/, (req, res) => {
        console.log(req.params);
        let floor_number = req.params[1].replace(/k/g, '');
        console.log(colors.magenta(`Navigating to route -> /floor/${floor_number}/${req.params[2]}`));
        printer_data_promise(`WHERE floor = '${floor_number}'`, pool).then(response => {
            helpers.requestedPrinterJoinToResponse(response, req);
            res.render(`./floors/${floor_number}-floor`, {
                floor_printers: response
            });
        })
    });

    app.get('/admin', function (req, res) {
        let sql_statement_get_snmp_adresses = 'SELECT * FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_get_snmp_adresses, function (error, result) {
                if (error) throw error;
                let hosts = [];
                result.forEach(data => hosts.push(data.ip));
                helpers.admin_render(hosts, result, res);
            });
            connection.release();
        });
    });

    app.get('/floors', function (req, res) {
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_get, function (error, result) {
                let floors_master = [];
                let floor_list = [];
                result.forEach(data => {
                    data.printer_ping = {alive: true};
                    floors_master.push(data);
                    if (!floor_list.includes(data.floor) && floor_list !== undefined) floor_list.push(data.floor);
                });

                if (error) throw error;
                res.render('./navbar/floors', {
                    floors: floor_list
                });
            });
            connection.release();
        });
    });

    //storage with optionated id
    app.get(/^\/storage(\/(?:([^\/]+?)))?$/, (req, res) => {
        let sql_statement_get = `SELECT * FROM printers_inc_supply.inc_supply_status;`;
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_get, (error, sql_data) => {
                if (error) throw error;
                let master_storage;
                let printer_param = req.params[0];

                if (printer_param === undefined) {
                    let toner_storage = helpers.arrayToObjectArray(helpers.uniqueCartridges(sql_data).unique_array);
                    master_storage = helpers.storageSorting(sql_data, toner_storage);
                }
                else {
                    master_storage = helpers.storageSorting(sql_data, printer_param);
                }
                res.render('./navbar/storage', {
                    storage: master_storage
                });
            });
            connection.release();
        });
    });

    app.get('/details/:name/:ip', (req, res) => {
        let result;
        for (let i = 0; i < printer_result.length; i++) {
            if (printer_result[i].name === req.params.name && printer_result[i].ip === req.params.ip) {
                result = printer_result[i];
                break;
            }
        }
        //TODO redirect if undefined
        res.render('./data/printer-detail', {
            chart: master, //TODO write html filter
            data: result
        })
    });

    app.get('/toner-usage-chart', function (req, res) {
        console.log(JSON.stringify(master));
        res.render('./navbar/charts', {
            chart: master
        });
    });

    //get file
    app.get('/email', (req, res) => {
        console.log(colors.magenta('Routing to backend email sender view -> /email'));
        let critical_toner = [];
        helpers.critical_printers(printer_result).forEach(response => {
            if (response.name !== 'RequestTimedOutError' && response.cartridge.critical === true) critical_toner.push(response);
        });
        let all_is_good = false;
        if (critical_toner.length === 0) all_is_good = true;

        res.render('./email/email', {
            printers: critical_toner,
            date: moment().format('DD-MM-YYYY'),
            all_is_good: all_is_good
        });
    });
    app.get('/restart', function (req, res, next) {
        process.exit(1);
    });

    /*
    *          Data generation
    * */

    setInterval(() => {
        let date = new Date();
        let day_name = moment().format('dddd');
        if (range_printer.contains(date.getHours()) && (day_name !== 'Saturday' || day_name !== 'Sunday')) printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {
            if (range_chart.contains(date.getHours()) && (day_name !== 'Saturday' || day_name !== 'Sunday')) chart(response).then(data => master = data);

            //insert data to pages_printed.sql
            if (date.getHours() === 16 && (day_name !== 'Saturday' || day_name !== 'Sunday')) {
                response.forEach(printer => {
                    if (printer.lifetime_print !== undefined) {
                        let sql_pages_printed = `INSERT INTO printers_inc_supply.pages_printed SET pages_printed = ${printer.lifetime_print}, ip='${printer.ip}', date='${moment().format('YYYY-MM-DD')}';`;
                        pool.getConnection((err, connection) => {
                            connection.query(sql_pages_printed, (error, result) => {
                                if (error) throw error;
                            });
                            console.log('Added data to pages_printed.sql, time:' + date.getHours() + ':' + date.getMinutes());
                            connection.release();
                        });
                    }
                });
            }
            printer_result = response;
        });
        console.log(`${day_name} data update in routing-get, time: - ${date.getHours()}:${date.getMinutes()}`);
    }, 2700000);
};
