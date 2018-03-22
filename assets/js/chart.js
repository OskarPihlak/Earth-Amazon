module.exports = (printer_data_saved) => {
    const colors = require('colors');
    let database = require('./db/db.js');
    const printer_oid_data = require('./oid-proccessing/oids.js');
    const pool = database.db_define_database();
    const moment = require('moment-business-days');
    const moment_range = require('moment-range');
    const moment_ranges = moment_range.extendMoment(moment);
    console.log('CHART DATA                                                                       '+printer_data_saved);

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            let sql_statmenet_get_target_statistics = 'SELECT * FROM printers_inc_supply.printer_cartridge_statistics;';
            connection.query(sql_statmenet_get_target_statistics, function (error, result, fields) {
               function CharDataGeneration(response) {

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
                            let i = 0;
                            while (result.length < 20) {
                                let date_today = new Date();
                                date_today.setDate(date_today.getDate() - i);
                                let formatted_date_today = moment(date_today).format('DD-MM-YYYY');
                                if (moment(formatted_date_today, 'DD-MM-YYYY').isBusinessDay() === true) {
                                    result.push(formatted_date_today);
                                }
                                i++
                            }
                            return {date_array: result, to_date: result[0], from_date: result[result.length - 1]};
                        }
                        const start = moment(daysVisibleOnChart().from_date, 'DD-MM-YYYY');
                        const end = moment(daysVisibleOnChart().to_date, 'DD-MM-YYYY');
                        const range = moment_ranges.range(start, end);

                        //work code
                        let master_printer_data = [];
                            master_printer_data.xgrid = [];
                            master_printer_data.dates = [];
                        for (let x = 0; x < uniquePrintersAndToners().length; x++) { //iterates every printer
                            let printer_iteration = [];
                            printer_iteration.printer = {};
                            printer_iteration.value = [];
                            printer_iteration.critical = false;
                            for (let i = 0; i < result.length; i++) { //iterates every result in statistics database

                                for (let z = 0; z < (uniquePrintersAndToners()[x].toner).length; z++) { //iterates every toner of iteratable printer

                                    if (result[i].cartridge === uniquePrintersAndToners()[x].toner[z] && result[i].printer_name === uniquePrintersAndToners()[x].name && range.contains(result[i].date) === true) { //checks date range, printer name and cartridge name
                                        printer_iteration.printer = result[i].printer_name; //TODO put dis to global alongside master_printer_data
                                        //if (moment(result[i].date).format('DD-MM-YYYY') === 'Monday') printer_iteration.lines.push(moment(result[i].date).format('DD'));
                                        if (master_printer_data.dates.includes(moment(result[i].date).format('DD-MM-YYYY')) === false) master_printer_data.dates.push(moment(result[i].date).format('DD-MM-YYYY'));
                                        if(result[i].precentage < 60) printer_iteration.critical = true;
                                        switch (result[i].color) {
                                            case 'black':
                                                printer_iteration.value.push({
                                                    date: moment(result[i].date).format('DD-MM-YYYY'),
                                                    black: result[i].precentage,
                                                    toner_black: result[i].cartridge
                                                });
                                                break;
                                            case 'cyan':
                                                printer_iteration.value.push({
                                                    date: moment(result[i].date).format('DD-MM-YYYY'),
                                                    cyan: result[i].precentage,
                                                    toner_cyan: result[i].cartridge
                                                });
                                                break;
                                            case 'yellow':
                                                printer_iteration.value.push({
                                                    date: moment(result[i].date).format('DD-MM-YYYY'),
                                                    yellow: result[i].precentage,
                                                    toner_yellow: result[i].cartridge
                                                });
                                                break;
                                            case 'magenta':
                                                printer_iteration.value.push({
                                                    date: moment(result[i].date).format('DD-MM-YYYY'),
                                                    magenta: result[i].precentage,
                                                    toner_magenta: result[i].cartridge
                                                });
                                                break;
                                        }
                                        break;
                                    }
                                }
                            }
                            let printer_object_container = [];
                            printer_object_container.printer_name = printer_iteration.printer;
                            master_printer_data.dates.forEach((date) => {

                                let objects_wirh_one_date = [];
                                printer_iteration.value.forEach((cartridge_object) => {
                                    if (cartridge_object.date === date) {
                                        cartridge_object.date = moment(date, 'DD-MM-YYYY').format('DD');
                                        cartridge_object.date_big = moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY');
                                        objects_wirh_one_date.push(cartridge_object);
                                    }
                                });
                                let unified_object_with_one_date = {};

                                objects_wirh_one_date.forEach(object => Object.assign(unified_object_with_one_date, object));

                                printer_object_container.push(unified_object_with_one_date);
                            });

                            master_printer_data.push(printer_object_container);
                        }
                        master_printer_data.dates.forEach((date)=>{
                             if(moment(date,'DD-MM-YYYY').format('dddd') === 'Monday') master_printer_data.xgrid.push({value:moment(date,'DD-MM-YYYY').format('DD'), text: `${(moment(date,'DD-MM-YYYY').format('W'))} Nädal`});
                        });

                        let sql_statement_get = 'SELECT name,color,floor,ip FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
                        pool.getConnection((err, connection) => {
                            connection.query(sql_statement_get, function (error, sql_data) {

                                for (let i = 0; i < master_printer_data.length; i++) {
                                    for (let x = 0; x < sql_data.length; x++) {
                                        if (master_printer_data[i].printer_name === sql_data[x].name) {
                                            master_printer_data[i].color = !!sql_data[x].color;
                                            master_printer_data[i].ip = sql_data[x].ip;
                                        }
                                    }
                                    master_printer_data[i].usage = [];
                                    master_printer_data[i].critical = false;
                                    let last_toner = master_printer_data[master_printer_data.length - 1]; //TODO make sure this works
                                    let critical_limit = 12;

                                    if (master_printer_data[i].color === true) {

                                        if(last_toner.black < critical_limit ||
                                           last_toner.cyan < critical_limit ||
                                           last_toner.yellow < critical_limit ||
                                           last_toner.magenta < critical_limit) master_printer_data[i].critical = true;  //TODO maybe write else statement...

                                        master_printer_data[i].usage.push({
                                            toner: master_printer_data[i][0].toner_black,
                                            used_per_day: precisionRound((master_printer_data[i][0].black - (master_printer_data[i]).last().black) / master_printer_data[i].length, 1)
                                        });
                                        master_printer_data[i].usage.push({
                                            toner: master_printer_data[i][0].toner_cyan,
                                            used_per_day: precisionRound((master_printer_data[i][0].cyan - (master_printer_data[i]).last().cyan) / master_printer_data[i].length, 1)
                                        });
                                        master_printer_data[i].usage.push({
                                            toner: master_printer_data[i][0].toner_yellow,
                                            used_per_day: precisionRound((master_printer_data[i][0].yellow - (master_printer_data[i]).last().yellow) / master_printer_data[i].length, 1)
                                        });
                                        master_printer_data[i].usage.push({
                                            toner: master_printer_data[i][0].toner_magenta,
                                            used_per_day: precisionRound((master_printer_data[i][0].magenta - (master_printer_data[i]).last().magenta) / master_printer_data[i].length, 1)
                                        });
                                    } else if (master_printer_data[i].color === false) {

                                        if(last_toner.black < critical_limit) master_printer_data[i].critical = true;

                                        master_printer_data[i].usage.push({
                                            toner: master_printer_data[i][0].toner_black,
                                            used_per_day: precisionRound((master_printer_data[i][0].black - (master_printer_data[i]).last().black) / master_printer_data[i].length, 1)
                                        });
                                    }
                                }
                                return resolve(master_printer_data);
                            });
                        });
                    }
                CharDataGeneration(printer_data_saved);
            });
        });
    });
};



