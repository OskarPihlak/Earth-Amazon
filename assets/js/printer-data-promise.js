module.exports = (sql_conditional, pool) => {

    const snmp = require("net-snmp");
    const mysql = require('mysql');
    let helpers = require('./helpers.js');
    const printer_oid_data = require('./oids.js');

    function getSnmpAdresses() {
        return new Promise((resolve, rejected) => {
            let sql_statement_get = `SELECT * FROM snmpadresses ${sql_conditional};`;

            pool.getConnection((err, connection) => {
                connection.query(sql_statement_get, function (error, result) {

                    if (error) throw(error);
                    let snmpAdresses = result.map(row => {
                        return {
                            ip: row.ip,
                            color: !!row.color,
                            name: row.name,
                            key: row.key_name,
                            max_capacity: !!row.max_capacity,
                            floor: row.floor,
                            position_left: row.position_left,
                            position_top: row.position_top
                        };
                    });
                    return resolve(snmpAdresses);
                });
                connection.release();
            });
        });
    }

//oids data parsing
    function printer_data_parse(printer, data) {

        return new Promise((resolve, reject) => {
            printer.cartridge = {};

            if (printer.color === true && printer.max_capacity === false) {
                for (let x = 0; x < printer_oid_data.colors_loop_info().length; x++) {
                    let printer_name = printer_oid_data.colors_loop_info()[x];
                    let inc_real_name = printer_name.inc_name;
                    printer.cartridge[inc_real_name] = {
                        value: data[printer_name.inc_number].value,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            } else if (printer.color === false && printer.max_capacity === false) {
                for (let x = 0; x < printer_oid_data.black_and_white_loop_info.length; x++) {
                    let printer_name = printer_oid_data.black_and_white_loop_info[x];
                    printer.cartridge[printer_name.inc_name] = {
                        value: data[printer_name.inc_number].value,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            } else if (printer.color === false && printer.max_capacity === true) {
                for (let x = 0; x < printer_oid_data.black_and_white_loop_info.length; x++) {
                    let printer_name = printer_oid_data.black_and_white_loop_info[x];
                    let inc_precentage = Math.round((data[printer_name.inc_number].value / data[printer_name.max_capacity_bw].value) * 100);
                    printer.cartridge[printer_name.inc_name] = {
                        value: inc_precentage,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            } else if (printer.color === true && printer.max_capacity === true) {
                for (let x = 0; x < printer_oid_data.colors_loop_info(); x++) {
                    let printer_name = printer_oid_data.colors_loop_info()[x];
                    let inc_precentage = Math.round((data[printer_name.inc_number].value / data[printer_oid_data.colors_loop_info()[x].max_capacity_color].value) * 100);
                    printer.cartridge[printer_name.inc_name] = {
                        value: inc_precentage,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            }

            let sql_statement_get = 'SELECT * FROM inc_supply_status WHERE printer_name ="' + printer.name + '"';
            pool.getConnection((err, connection) => {

                connection.query(sql_statement_get, function (error, sql_data) {
                    if (error) return reject(error);
                    if (printer.color === true) {
                        for (let x = 0; x < printer_oid_data.colors_loop_info().length; x++) {
                            let printer_name = printer_oid_data.colors_loop_info()[x].inc_name;
                            printer.cartridge[printer_name].supply = {storage: sql_data[x].cartridge_supply}; //this gives error if database has no data
                        }

                    } else if (printer.color === false) {
                        for (let x = 0; x < printer_oid_data.black_and_white_loop_info.length; x++) {
                            let printer_name = printer_oid_data.black_and_white_loop_info[x].inc_name;
                            printer.cartridge[printer_name].supply = {storage: sql_data[x].cartridge_supply};
                        }
                    }
                    return resolve(printer);
                });
                connection.release();
            });
        });
    }

//Parse the oids to usable data
    let session_get = (printer, oids) => {
        return new Promise((resolve, reject) => {
            let session = snmp.createSession(printer.ip, "public");
            session.get(oids, (err, data) => {
                if (err) {
                    console.log('session_get_error', err);
                    console.log('session_get_data', data);
                    return reject(err);
                }


                printer_data_parse(printer, data).then(data => {
                    return resolve(data);
                }).catch(error => {
                    console.log('printer_data_parse_error', error);
                    reject(error);
                });
            });
        });
    };

//Construct correct oids for printers
    return getSnmpAdresses().then(adresses => {
        return Promise.all(adresses.map((adress) => {
            if (adress.color === true && adress.max_capacity === false) {
                return session_get(adress, printer_oid_data.oidsArray.pr_name.concat(printer_oid_data.oidsArray.bw, printer_oid_data.oid_color_array())).catch(function (err) {
                    return err;
                });
            }
            else if (adress.color === false && adress.max_capacity === true) {
                return session_get(adress, printer_oid_data.oidsArray.pr_name.concat(printer_oid_data.oidsArray.bw, printer_oid_data.oidsArray.max_capacity_bw)).catch(function (err) {
                    return err;
                });
            }
            else if (adress.color === false && adress.max_capacity === false) {
                return session_get(adress, printer_oid_data.oidsArray.pr_name.concat(printer_oid_data.oidsArray.bw)).catch(function (err) {
                    return err;
                });
            }
            else if (adress.color === true && adress.max_capacity === true) {
                return session_get(adress, printer_oid_data.oidsArray.pr_name.concat(printer_oid_data.oidsArray.bw, printer_oid_data.oid_color_array(), printer_oid_data.oidsArray.max_capacity_bw, printer_oid_data.oidsArray.max_capacity_color)).catch(function (err) {
                    return err;
                });
            }
        }));
    });
};