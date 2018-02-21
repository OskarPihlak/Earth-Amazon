module.exports = function (app) {
    const bodyParser = require('body-parser');
    const nodemailer = require('nodemailer');
    const mysql = require('mysql');
    const pad = require('pad-number');
    const urlEncodedParser = bodyParser.urlencoded({extended: false});
    const printer_data_promise = require('./printer-data-promise');
    const database = require('./db.js');
    const helpers = require('./helpers.js');
    const cartridge_add = require('./cartridge-add.js');
    const printer_oid_data = require('./oids.js');
    const moment = require('moment');
    let pool = database.db_define_database();
    const colors = require('colors');
    const fs = require('fs');
    const Hogan = require('hogan.js');
    const Handlebars = require('handlebars');
    const moment_range = require('moment-range');
    const moment_ranges = moment_range.extendMoment(moment);
    const chart = require('./chart.js');

    let chart_master = [];
    const range = moment_ranges.range(5, 9);
    chart().then(data => chart().then(data => {
        if (data.critical) chart_master.push(data);
    }));
    setInterval(() => {
        let date = new Date();
        let day_name = moment().format('dddd');
        if (range.contains(date.getHours()) && (day_name !== 'Saturday' || day_name !== 'Sunday')) {
            chart().then(data => {
                if (data.critical) chart_master.push(data);
            });
        }
    }, 2700000);







setInterval(()=>{
    if((moment.format('dddd') === 'Monday' || moment.format('dddd') === 'Friday') && moment_ranges.range(5, 9).contains(moment.format('H'))){
    let template = fs.readFileSync('./views/email.handlebars', 'utf-8');
    let compileTemplate = Handlebars.compile(template);
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

        let finalPageHTML = compileTemplate({
            printers: critical_toner,
            date: moment().format('DD-MM-YYYY'),
            all_is_good: all_is_good
        });
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: "smtp.office365.com",
                port: 587,
                secure: false,
                auth: {
                    user: 'oskar.pihlak@eestimeedia.ee',
                    pass: 'WorkDragon88'
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            });
            let mailOptions = {
                from: '"Eesti Meedia Printerid " <oskar.pihlak@eestimeedia.ee>',
                to: 'oskar.pihlak@eestimeedia.ee ,it@eestimeedia.ee',
                subject: 'Madala tasemega toonerid',
                html: finalPageHTML
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return console.log(error);
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });
       });
    }
        },2700000);



        app.post('/emailstuff', urlEncodedParser, function (req, res) {
            let template = fs.readFileSync('./views/email.handlebars', 'utf-8');
            let compileTemplate = Handlebars.compile(template);
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

                let finalPageHTML = compileTemplate({
                    printers: critical_toner,
                    date: moment().format('DD-MM-YYYY'),
                    all_is_good: all_is_good
                });
                nodemailer.createTestAccount((err, account) => {
                    let transporter = nodemailer.createTransport({
                        host: "smtp.office365.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'oskar.pihlak@eestimeedia.ee',
                            pass: 'WorkDragon88'
                        },
                        tls: {
                            ciphers: 'SSLv3'
                        }
                    });
                    let mailOptions = {
                        from: '"Eesti Meedia Printerid " <oskar.pihlak@eestimeedia.ee>',
                        to: 'oskar.pihlak@eestimeedia.ee ,it@eestimeedia.ee',
                        subject: 'Madala tasemega toonerid',
                        html: finalPageHTML
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) return console.log(error);
                        console.log('Message sent: %s', info.messageId);
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });
                });
            });
            res.redirect('/preview');
        });



    setInterval(() => {
    }, 2700000);

    let low_toner_printers;
    printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {
        console.log(colors.red(response));
    });


    app.post('/admin/update', urlEncodedParser, function (req, res) {
        console.log(req);
        let printer_id = (req.body.printer_measure).slice(4);
        let sql_statement_put_snmpadresses = "UPDATE printers_inc_supply.snmpadresses SET ip='" + req.body.printer_ip + "', name='" + req.body.printer_name + "', key_name='" + req.body.printer_name + "__', color=" + req.body.printer_color + ", max_capacity=" + req.body.printer_max_capacity + ", floor=" + req.body.printer_floor + " WHERE id=" + printer_id + ";";
        let sql_statement_put_printer_inc_supply = `UPDATE printers_inc_supply.inc_supply_status SET printer_name ='${req.body.printer_name}' WHERE printer_name='${req.body.printer_old_name}';`;

        pool.getConnection((err, connection) => {
            connection.query(sql_statement_put_snmpadresses, function (error, data) {
                if (error) throw error;
            });
            connection.release();
        });
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_put_printer_inc_supply, function (error, data) {
                if (error) throw error;
                console.log(data);
            });
            connection.release();
        });
        res.redirect('/admin');
    });

    app.post('/update/marker/position', urlEncodedParser, function (req, res) {
        let sql_statement_update_snmp_adresses = "UPDATE printers_inc_supply.snmpadresses SET position_top='" + req.body.top + "', position_left='" + req.body.left + "' WHERE name='" + req.body.name + "';";
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_update_snmp_adresses, function (error, data) {
                if (error) throw error;
                res.redirect('/' + req.body.floor + 'k/' + req.body.name);
            });
            connection.release();
        });
    });


    app.post('/admin/printer/add', urlEncodedParser, function (req, res) {
        if (req.body.input_ip_submit !== '' && req.body.input_name_submit !== '') {

            let printer_color_status = req.body.input_color_submit;
            let printer_ip = req.body.input_ip_submit;
            let printer_name = req.body.input_name_submit;
            let printer_floor_with_k = req.body.input_floor_submit;
            let printer_floor_without_k = printer_floor_with_k.slice(0, -1);
            console.log(printer_floor_without_k);
            let sql_snmp_adresses_insert = `INSERT INTO printers_inc_supply.snmpadresses SET ip='${req.body.input_ip_submit}', color=${req.body.input_color_submit}, name='${req.body.input_name_submit}', key_name='${req.body.input_name_submit}__' , max_capacity=${req.body.input_max_capacity_submit}, floor=${req.body.input_floor_submit},position_left=400, position_top=400;`;
            cartridge_add.cartridge_add(printer_ip, printer_name, printer_color_status, pool);
            console.log(printer_ip, printer_name, printer_color_status);
            pool.getConnection((err, connection) => {
                connection.query(sql_snmp_adresses_insert, (error, data) => {
                    if (error) throw error;
                });
                connection.release();
            });

            res.redirect('/admin');

        } else {
            res.redirect('/admin');
        }
    });

    app.post('/cartridge/storage', urlEncodedParser, function (req, res) {
        let sql_statement_put = "UPDATE printers_inc_supply.inc_supply_status SET cartridge_supply=" + req.body.inc_storage_count + " WHERE cartridge_name='" + req.body.inc_storage_name + "';";
        console.log(sql_statement_put);
        pool.getConnection((err, connection) => {
            connection.query(sql_statement_put, function (error, data) {
                console.log(data);
                if (error) throw error;
                res.redirect(`${req.body.update_route}`);
            });
            connection.release();
        });
    });
    setInterval(function () {
        let day_name = moment().format('dddd');
        let date = new Date();
        if (date.getHours() === 1 && (day_name !== 'Saturday' || day_name !== 'Sunday') && parseInt(Math.abs(moment().format('DD') % 2)) === 1) { //pushed to server on odd workdays at 1AM
            printer_data_promise("WHERE ip IS NOT NULL ORDER BY length(floor) DESC, floor DESC", pool).then(response => {
                let date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                for (let i = 0; i < response.length; i++) {
                    pool.getConnection((err, connection) => {

                        if (response[i].color === true) {
                            for (let u = 0; u < 4; u++) {
                                let color_printer_statistics = `INSERT INTO printers_inc_supply.printer_cartridge_statistics SET printer_name='${response[i].name}',color='${printer_oid_data.colors_loop_info()[u].inc_name}', cartridge='${response[i].cartridge[printer_oid_data.colors_loop_info()[u].inc_name].name}', precentage=${response[i].cartridge[printer_oid_data.colors_loop_info()[u].inc_name].value}, date='${`${year}-${month}-${pad(day, 2)}`}';`;
                                console.log(color_printer_statistics);
                                connection.query(color_printer_statistics, function (error, result, fields) {
                                    console.log(result);
                                });
                            }
                        } else if (response[i].color === false) {
                            let black_printer_statistics = `INSERT INTO printers_inc_supply.printer_cartridge_statistics SET printer_name='${response[i].name}',color='${printer_oid_data.colors_loop_info()[0].inc_name}', cartridge='${response[i].cartridge[printer_oid_data.colors_loop_info()[0].inc_name].name}', precentage=${response[i].cartridge[printer_oid_data.colors_loop_info()[0].inc_name].value}, date='${`${year}-${month}-${pad(day, 2)}`}';`;
                            console.log(black_printer_statistics);
                            connection.query(black_printer_statistics, function (error, result, fields) {
                            });
                        }
                        connection.release();
                    });
                }
            });
        }
    }, 2700000);    //1h
};















