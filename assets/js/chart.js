module.exports = (printer_data_saved) => {
    const colors = require('colors');
    let database = require('./db/db.js');
    const printer_oid_data = require('./oid-proccessing/oids.js');
    const pool = database.db_define_database();
    const moment = require('moment-business-days');
    const moment_range = require('moment-range');
    const moment_ranges = moment_range.extendMoment(moment);

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {

            let sql_statmenet_get_target_statistics = 'SELECT * FROM printers_inc_supply.printer_cartridge_statistics;';
            connection.query(sql_statmenet_get_target_statistics, function (error, result, fields) {
                function CharDataGeneration(response) {

                    function precisionRound(number, precision) {
                        let factor = Math.pow(10, precision);
                        return Math.round(number * factor) / factor;
                    }

                    let unique_printers_and_toners = () => {
                        let unique_data = [];
                        response.forEach(printer => {
                            let toners = [];
                            if (printer.color) {
                                for (let i = 0; i < 4; i++) {
                                    toners.push(printer.cartridge[printer_oid_data.colors_loop_info()[i].inc_name].name);
                                }
                            }
                            else if (!printer.color) {
                                toners.push(printer.cartridge[printer_oid_data.colors_loop_info()[0].inc_name].name);
                            }
                            unique_data.push({name: printer.name, toner: toners})
                        });
                        return unique_data;
                    };

                    let displayed_date_range = () => {
                        const days_visible = 20;
                        let result = [];
                        let i = 0;

                        while (result.length < days_visible) {
                            let today = new Date();
                            let day = moment(today.setDate(today.getDate() - i)).format('YYYY-MM-DD');
                            if (moment(day, 'DD-MM-YYYY').isBusinessDay() === true) result.push(day);
                            i++
                        }
                        const start = moment(result[result.length - 1],'YYYY-MM-DD');
                        const end =   moment(result[0], 'YYYY-MM-DD');
                        return moment_ranges.range(start, end);
                    };

                    let master_data = [];
                        master_data.xgrid = [];
                        master_data.dates = [];

                    unique_printers_and_toners().forEach(printer => {
                        let data = [];
                        data.printer = {};
                        data.value = [];
                        data.critical = false;

                        result.forEach(database_element => {
                            printer.toner.forEach(toner => {

                                if (database_element.cartridge === toner &&
                                    database_element.printer_name === printer.name &&
                                    displayed_date_range().contains(database_element.date)) {

                                    data.printer = database_element.printer_name; //TODO put dis to global alongside master_data
                                    if(!master_data.dates.includes(moment(database_element.date).format('DD-MM-YYYY'))) master_data.dates.push(moment(database_element.date).format('DD-MM-YYYY'));
                                    if(database_element.precentage < 10) data.critical = true;

                                    data.value.push({
                                        date:                                moment(database_element.date).format('DD-MM-YYYY'),
                                        [database_element.color]:            database_element.precentage,
                                        [`toner_`+ database_element.color] : database_element.cartridge
                                    });
                                    console.log(colors.red('chart data'));
                                    console.log(data);
                                }
                            });
                        });
                        let printer_objects = [];
                            printer_objects.printer_name = data.printer;
                            master_data.dates.forEach(date => {
                                let single_date_object = [];
                                data.value.forEach(toner_object => {
                                    if (toner_object.date === date) {
                                        toner_object.date = moment(date, 'DD-MM-YYYY').format('DD');
                                        toner_object.date_big = moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY');
                                        single_date_object.push(toner_object);
                                    }
                                });
                                let combined_single_date_object = [];
                                    combined_single_date_object.forEach(object => Object.assign(combined_single_date_object, object));
                                    printer_objects.push(combined_single_date_object);
                            });

                        data.push(printer_objects);
                    });

                    master_data.dates.forEach((date) => {
                        if (moment(date, 'DD-MM-YYYY').format('dddd') === 'Monday') master_data.xgrid.push({
                            value: moment(date, 'DD-MM-YYYY').format('DD'),
                            text: `${(moment(date, 'DD-MM-YYYY').format('W'))} Nädal`
                        });
                    });






                    let sql_statement_get = 'SELECT name,color,floor,ip FROM printers_inc_supply.snmpadresses ORDER BY length(floor) DESC, floor DESC;';
                    pool.getConnection((err, connection) => {
                        connection.query(sql_statement_get, function (error, sql_data) {

                            for (let i = 0; i < master_data.length; i++) {
                                for (let x = 0; x < sql_data.length; x++) {
                                    if (master_data[i].printer_name === sql_data[x].name) {
                                        master_data[i].color = !!sql_data[x].color;
                                        master_data[i].ip = sql_data[x].ip;
                                    }
                                }
                                master_data[i].usage = [];
                                master_data[i].critical = false;
                                let last_toner = master_data[master_data.length - 1]; //TODO make sure this works
                                let critical_limit = 12;

                                if (master_data[i].color === true) {

                                    if (last_toner.black < critical_limit ||
                                        last_toner.cyan < critical_limit ||
                                        last_toner.yellow < critical_limit ||
                                        last_toner.magenta < critical_limit) master_data[i].critical = true;  //TODO maybe write else statement...

                                    master_data[i].usage.push({
                                        toner: master_data[i][0].toner_black,
                                        used_per_day: precisionRound((master_data[i][0].black - (master_data[i]).last().black) / master_data[i].length, 1)
                                    });
                                    master_data[i].usage.push({
                                        toner: master_data[i][0].toner_cyan,
                                        used_per_day: precisionRound((master_data[i][0].cyan - (master_data[i]).last().cyan) / master_data[i].length, 1)
                                    });
                                    master_data[i].usage.push({
                                        toner: master_data[i][0].toner_yellow,
                                        used_per_day: precisionRound((master_data[i][0].yellow - (master_data[i]).last().yellow) / master_data[i].length, 1)
                                    });
                                    master_data[i].usage.push({
                                        toner: master_data[i][0].toner_magenta,
                                        used_per_day: precisionRound((master_data[i][0].magenta - (master_data[i]).last().magenta) / master_data[i].length, 1)
                                    });
                                } else if (master_data[i].color === false) {

                                    if (last_toner.black < critical_limit) master_data[i].critical = true;

                                    master_data[i].usage.push({
                                        toner: master_data[i][0].toner_black,
                                        used_per_day: precisionRound((master_data[i][0].black - (master_data[i]).last().black) / master_data[i].length, 1)
                                    });
                                }
                            }
                            return resolve(master_data);
                        });
                    });
                }

                CharDataGeneration(printer_data_saved);
            });
        });
    });
};



