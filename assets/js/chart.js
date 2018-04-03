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

                let printers = () => {
                    let printer_data_formatted_toners = [];
                    printer_data_saved.forEach(printer => {
                        printer.toner = [];
                        if (printer.color) {
                            for (let i = 0; i < 4; i++) {

                                printer.toner.push(printer.cartridge[printer_oid_data.colors_loop_info()[i].inc_name].name);
                            }
                        }
                        else if (!printer.color) {
                            printer.toner.push(printer.cartridge[printer_oid_data.colors_loop_info()[0].inc_name].name);
                        }
                        printer_data_formatted_toners.push(printer);
                    });
                    return printer_data_formatted_toners;
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
                    const start = moment(result[result.length - 1], 'YYYY-MM-DD');
                    const end = moment(result[0], 'YYYY-MM-DD');
                    return moment_ranges.range(start, end);
                };



                let printer_page_source = [];
                printers().forEach(printer => {
                    console.log(printer);
                    printer.toner_graph = [];
                    printer.xgrid = [];
                    let data = [];
                    data.value = [];
                    data.dates = [];
                    data.graph_data = [];

                    result.forEach(database_element => {
                        printer.toner.forEach(toner => {

                            if (database_element.cartridge === toner &&
                                database_element.printer_name === printer.name &&
                                displayed_date_range().contains(database_element.date)) {

                                if (!data.dates.includes(moment(database_element.date).format('DD-MM-YYYY'))) data.dates.push(moment(database_element.date).format('DD-MM-YYYY'));

                                data.graph_data.push({
                                    date: moment(database_element.date).format('DD-MM-YYYY'),
                                    [database_element.color]: database_element.precentage,
                                    [`toner_` + database_element.color]: database_element.cartridge
                                });
                            }
                        });
                    });
                    if (data.length = 0) {
                        console.log('data is empty')
                    }
                    let printer_objects = [];
                    printer_objects.printer_name = printer.name;
                    printer_objects.ip = printer.ip;
                    printer_objects.color = printer.color;

                    data.dates.forEach(date => {
                        let single_date_object = [];
                        data.graph_data.forEach(toner_object => {
                            if (toner_object.date === date) {
                                toner_object.date = moment(date, 'DD-MM-YYYY').format('DD');
                                toner_object.date_big = moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY');
                                single_date_object.push(toner_object);
                            }
                        });

                        let combined_single_date_object = {};
                        single_date_object.forEach(object => Object.assign(combined_single_date_object, object));
                        printer.toner_graph.push(combined_single_date_object);

                    });

                    data.dates.forEach((date) => {
                        if (moment(date, 'DD-MM-YYYY').format('dddd') === 'Monday') printer.xgrid.push({
                            value: moment(date, 'DD-MM-YYYY').format('DD'),
                            text: `${(moment(date, 'DD-MM-YYYY').format('W'))} Nädal`
                        });
                    });
                    printer_page_source.push(printer);
                    console.log(printer)
                });
                connection.release();
                return resolve(printer_page_source);
            });
        });
    });
};

