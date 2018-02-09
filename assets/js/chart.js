module.exports = ()=>{
    const printer_data_promise = require('./printer-data-promise');
    let database = require('./db.js');
    const printer_oid_data = require('./oids.js');
    const pool = database.db_define_database();
    const moment = require('moment-business-days');
    const helpers = require('./helpers.js');

    return new Promise((resolve, reject)=> {
        pool.getConnection((err, connection) => {

            let sql_statmenet_get_target_statistics = 'SELECT * FROM printers_inc_supply.printer_cartridge_statistics;';
            connection.query(sql_statmenet_get_target_statistics, function (error, result, fields) {
                printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {

                    function precisionRound(number, precision) {
                        let factor = Math.pow(10, precision);
                        return Math.round(number * factor) / factor;
                    }

                    function uniquePrintersAndToners() {
                        let unique_printers_and_toners = [];
                        for (let i = 0; i < response.length; i++) {
                            let cartridge_array = [];
                            if (response[i].color === true) {
                                for (let y = 0; y < 4; y++) {
                                    cartridge_array.push(response[i].cartridge[printer_oid_data.colors_loop_info()[y].inc_name].name);
                                }
                                unique_printers_and_toners.push({name: response[i].name, toner: cartridge_array});
                            } else if (response[i].color === false) {
                                cartridge_array.push(response[i].cartridge[printer_oid_data.colors_loop_info()[0].inc_name].name);
                                unique_printers_and_toners.push({name: response[i].name, toner: cartridge_array});
                            }
                        }
                        return unique_printers_and_toners;
                    }
                    function daysVisibleOnChart() {
                        let result = [];
                        let i=0;
                        while (result.length < 8){
                            let date_today = new Date();
                            date_today.setDate(date_today.getDate() - i);
                            let formatted_date = moment(date_today).format('DD-MM-YYYY');
                            if(moment(formatted_date, 'DD-MM-YYYY').isBusinessDay() === true){
                                result.push( formatted_date );
                            }
                            i++
                        }
                        return result;
                    }

                    //work code

                    let master_printer_data = [];
                    for (let x = 0; x < uniquePrintersAndToners().length; x++) { //iterates every printer
                        let unified = [];
                        unified.printer = {};
                        unified.value = [];

                        for (let i = 0; i < result.length; i++) { //iterates every result in statistics database

                            for (let z = 0; z < (uniquePrintersAndToners()[x].toner).length; z++) { //iterates every toner of iteratable printer

                                if (result[i].cartridge === uniquePrintersAndToners()[x].toner[z] && result[i].printer_name === uniquePrintersAndToners()[x].name) {

                                    unified.printer = result[i].printer_name;
                                    switch (result[i].color) {
                                        case 'black':
                                            unified.value.push({date: moment(result[i].date).format('DD-MM-YYYY'), black: result[i].precentage, toner_black: result[i].cartridge });
                                            break;
                                        case 'cyan':
                                            unified.value.push({date: moment(result[i].date).format('DD-MM-YYYY'), cyan: result[i].precentage, toner_cyan: result[i].cartridge });
                                            break;
                                        case 'yellow':
                                            unified.value.push({ date: moment(result[i].date).format('DD-MM-YYYY'), yellow: result[i].precentage, toner_yellow: result[i].cartridge });
                                            break;
                                        case 'magenta':
                                            unified.value.push({ date: moment(result[i].date).format('DD-MM-YYYY'), magenta: result[i].precentage, toner_magenta: result[i].cartridge });
                                            break;
                                    }
                                }
                            }
                        }

                        //get dates of last 7 days
                        let printer_data = [];
                        printer_data.value = [];
                        for (let x = 0; x < daysVisibleOnChart().length; x++) { //iterate last 7 day dates
                            let day_toners = [];

                            for (let i = 0; i < unified.value.length; i++) { //cartridge objects in array
                                if (unified.value[i].date === daysVisibleOnChart()[x]) {
                                    day_toners.push(unified.value[i]);
                                }
                            }
                            let temporary_toner_object = {};
                            for (let i = 0; i < day_toners.length; i++) {
                                Object.assign(temporary_toner_object, day_toners[i]);
                            }

                            if (helpers.isEmpty(temporary_toner_object) === false) {
                                printer_data.value.push(temporary_toner_object);
                            }
                        }
                        printer_data.printer = unified.printer;
                        master_printer_data.push(printer_data);
                    }
                    let sql_statement_get = 'SELECT name,color,floor,ip FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
                    pool.getConnection((err, connection) => {
                        connection.query(sql_statement_get, function (error, sql_data) {
                            for (let i = 0; i < master_printer_data.length; i++) {
                                for (let x = 0; x < sql_data.length; x++) {
                                    if (master_printer_data[i].printer === sql_data[x].name) {
                                        master_printer_data[i].color = !!sql_data[x].color;
                                        master_printer_data[i].ip = sql_data[x].ip;
                                        master_printer_data[i].value.reverse();
                                    }
                                }
                            }
                            for (let i = 0; i < master_printer_data.length; i++) {

                                master_printer_data[i].usage = [];
                                if (master_printer_data[i].color === true) {
                                    master_printer_data[i].usage.push({
                                        toner: master_printer_data[i].value[0].toner_black,
                                        used_per_day: precisionRound((master_printer_data[i].value[0].black - (master_printer_data[i].value).last().black) / master_printer_data[i].value.length,1)
                                    });
                                    master_printer_data[i].usage.push({
                                        toner: master_printer_data[i].value[0].toner_cyan,
                                        used_per_day: precisionRound((master_printer_data[i].value[0].cyan - (master_printer_data[i].value).last().cyan) / master_printer_data[i].value.length,1)
                                    });
                                    master_printer_data[i].usage.push({
                                        toner: master_printer_data[i].value[0].toner_yellow,
                                        used_per_day: precisionRound((master_printer_data[i].value[0].yellow - (master_printer_data[i].value).last().yellow) / master_printer_data[i].value.length,1)
                                    });
                                    master_printer_data[i].usage.push({
                                        toner: master_printer_data[i].value[0].toner_magenta,
                                        used_per_day: precisionRound((master_printer_data[i].value[0].magenta - (master_printer_data[i].value).last().magenta) / master_printer_data[i].value.length,1)
                                    });
                                } else if (master_printer_data[i].color === false) {
                                    master_printer_data[i].usage.push({
                                        toner: master_printer_data[i].value[0].toner_black,
                                        used_per_day: precisionRound((master_printer_data[i].value[0].black - (master_printer_data[i].value).last().black) / master_printer_data[i].value.length,1)
                                    });
                                }
                            }
                            console.log(master_printer_data);
                            return resolve(master_printer_data);
                        });
                    });
                });
            });
        });
    });
};
