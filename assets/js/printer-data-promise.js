module.exports = (sql_conditional) => {


    const snmp = require("net-snmp");
    const mysql = require('mysql');
    let db = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'printers_inc_supply'
    });
    db.connect(function (err) {

        if (err) throw err;
        console.log('Mysql connected to printers_inc_supply on 127.0.0.1');
    });

    let colorArray = [];
    let black_and_white_loop_info = [
        {inc_name: 'black', cartridge_number: 1, inc_number: 2, max_capacity_bw: 3, max_capacity_color: 9}];
    let colors_info = [{
        inc_name: 'cyan',
        cartridge_number: 3,
        inc_number: 4,
        max_capacity_bw: 3,
        max_capacity_color: 10
    },
        {inc_name: 'magenta', cartridge_number: 5, inc_number: 6, max_capacity_bw: 3, max_capacity_color: 11},
        {inc_name: 'yellow', cartridge_number: 7, inc_number: 8, max_capacity_bw: 3, max_capacity_color: 12}];
    let colors_loop_info = black_and_white_loop_info.concat(colors_info);

    /* let snmpAdresses =[
         {ip: "192.168.67.47",   color: true,   name: 'pr_tln_12k_HP_MFP252n', key: 'pr_tln_12k_HPMFP252n__', max_capacity: false, floor:'12k'},        //pr-tln-12k-HP_MFP252n
         {ip: "192.168.160.32",  color: false,  name: 'pr_tln_10k_HP2420n',    key: 'pr_tln_10k_HP2420n__',   max_capacity: true, floor:'10k'},        //pr-tln-10k-HP2420n
         {ip: "192.168.66.30",   color: true,   name: 'pr_tln_10k_HPM476dn',   key: 'pr_tln_10k_HPM476dn__',  max_capacity: false, floor:'10k'},        //pr-tln-10k-HPM476dn
         {ip:"192.168.66.26",    color: true,   name: 'pr_tln_6k_HPM476dn',    key:'pr_tln_6k_HPM476dn__',    max_capacity: false, floor:'6k'},        //pr-tln-6k-HPM476dn
         {ip: "192.168.66.13",   color: false,  name: 'pr_tln_6k_HP400dne',    key: 'pr_tln_6k_HP400dne__',   max_capacity: false, floor:'6k'},        //pr-tln-6k-HP400dne
         {ip: "192.168.67.10",   color: false,  name: 'pr_tln_6k_HP400',       key: 'pr_tln_6k_HP400__',      max_capacity: false, floor:'6k'},        //pr-tln-6k-HP400
         {ip: "192.168.156.133", color: true,   name: 'pr_tln_6k_HP200',       key: 'pr_tln_6k_HP200__',      max_capacity: false, floor:'6k'},        //pr-tln-6k-HP200
         {ip: "192.168.66.35",   color: true,   name: 'pr_tln_5k_HP200',       key: 'pr_tln_5k_HP200__',      max_capacity: false, floor:'5k'},        //pr-tln-5k-HP200
         {ip: "192.168.66.38",   color: true,   name: 'pr_tln_4k_HP5225dn',    key: 'pr_tln_4k_HP5225dn__',   max_capacity: false, floor:'4k'},        //pr-tln-4k-HP5225dn
         {ip: "192.168.67.15",   color: false,  name: "pr_tln_4k_HP400",       key: 'pr_tln_4k_HP400__',      max_capacity: false, floor:'4k' },        //pr-tln-4k-HP400
         {ip: "192.168.67.3",    color: false,  name: 'pr_tln_4k_HP_P3005',    key: 'pr_tln_4k_HP_P3005__',   max_capacity: true,  floor:'4k'},        //pr-tln-4k-HP_P3005
         {ip: "192.168.66.11",   color: false,  name: 'pr_tln_4k_HP521dn',     key: 'pr_tln_4k_HP521dn__',    max_capacity: false, floor:'4k'},        //pr-tln-4k-HP521dn
         {ip: "192.168.66.185",  color: true,   name: 'pr_tln_4k_HP_CP5225n',  key: 'pr_tln_4k_HP_CP5225n__', max_capacity: false, floor:'4k'},
         {ip: "192.168.66.16",   color: false,  name: 'pr_tln_4k_HPLJ_5200',   key: 'pr_tln_4k_HPLJ_5200__',  max_capacity: true, floor:'4k'},
         {ip: "192.168.66.187",  color: true,   name: 'pr_tln_2k_HP476dn',     key: 'pr_tln_2k_HP476dn__',    max_capacity: false, floor:'2k'},        //pr-tln-3k-HP476dn
         //--{ip:"192.168.71.10",  color: false,  name:'pr-tln-k3-k2-HPM605',    key:'pr_tln_3k_2k_HPM605__',   max_capacity: ? },        //pr-tln-k3-k2-HPM605 different network
         {ip: "192.168.81.10",   color: true,   name: 'pr_tln_2k_HPPro8610',   key: 'pr_tln_2k_HPPro8610__',  max_capacity: true, floor:'2k'},        //pr-tln-2k-HPPro8610
         {ip: "192.168.152.57",  color: false,  name: 'pr_tln_2k_HP1320n',     key: 'pr_tln_2k_HP1320n__',    max_capacity: true, floor:'2k'},        //pr-tln-2k-HP1320n
         {ip: "192.168.66.28",   color: false,  name: 'pr_tln_1k_HP255dn',     key: 'pr_tln_1k_HP255dn__',    max_capacity: false, floor:'1k'},        //pr-tln-1k-HP255dn
     ];*/

function getSnmpAdresses() {
    return new Promise((resolve, rejected) => {
        let sql_statement_get = 'SELECT * FROM printers_inc_supply.snmpadresses ' + sql_conditional;
        let query = db.query(sql_statement_get, function (error, sql_data) {
            if (error) reject(error);
            let snmpAdresses = sql_data.map(row => {
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
    });
};
        let oidsArray = {
        pr_name: ["1.3.6.1.2.1.1.5.0"],
        bw: ["1.3.6.1.2.1.43.11.1.1.6.1.1",        //black name
            "1.3.6.1.2.1.43.11.1.1.9.1.1"],       //black cartridge
        colors: {
            cyan_name: "1.3.6.1.2.1.43.11.1.1.6.1.2",     //cyan name
            cyan: "1.3.6.1.2.1.43.11.1.1.9.1.2",     //cyan cartridge
            magenta_name: "1.3.6.1.2.1.43.11.1.1.6.1.3",     //magenta name
            magenta: "1.3.6.1.2.1.43.11.1.1.9.1.3",     //magenta cartridge
            yellow_name: "1.3.6.1.2.1.43.11.1.1.6.1.4",     //yellow name
            yellow: "1.3.6.1.2.1.43.11.1.1.9.1.4"
        },     //yellow cartridge
        max_capacity_bw: ["1.3.6.1.2.1.43.11.1.1.8.1.1"],
        max_capacity_color: ["1.3.6.1.2.1.43.11.1.1.8.1.2",
            "1.3.6.1.2.1.43.11.1.1.8.1.3",
            "1.3.6.1.2.1.43.11.1.1.8.1.4"
        ]
    };

    Object.keys(oidsArray.colors).map(function (key) {
        colorArray.push(oidsArray.colors[key]);
    });

//oids data parsing
    function printer_data_parse(printer, data) {

        return new Promise((resolve, reject) => {
            printer.cartridge = {};

            if (printer.color === true && printer.max_capacity === false) {
                for (let x = 0; x < colors_loop_info.length; x++) {
                    let printer_name = colors_loop_info[x];
                    let inc_real_name = printer_name.inc_name;
                    printer.cartridge[inc_real_name] = {
                        value: data[printer_name.inc_number].value,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            } else if (printer.color === false && printer.max_capacity === false) {
                for (let x = 0; x < black_and_white_loop_info.length; x++) {
                    let printer_name = black_and_white_loop_info[x];
                    printer.cartridge[printer_name.inc_name] = {
                        value: data[printer_name.inc_number].value,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            } else if (printer.color === false && printer.max_capacity === true) {
                for (let x = 0; x < black_and_white_loop_info.length; x++) {
                    let printer_name = black_and_white_loop_info[x];
                    let inc_precentage = Math.round((data[printer_name.inc_number].value / data[printer_name.max_capacity_bw].value) * 100);
                    printer.cartridge[printer_name.inc_name] = {
                        value: inc_precentage,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            } else if (printer.color === true && printer.max_capacity === true) {
                for (let x = 0; x < colors_loop_info.length; x++) {
                    let printer_name = colors_loop_info[x];
                    let inc_precentage = Math.round((data[printer_name.inc_number].value / data[colors_loop_info[x].max_capacity_color].value) * 100);
                    printer.cartridge[printer_name.inc_name] = {
                        value: inc_precentage,
                        name: data[printer_name.cartridge_number].value.toString('utf8')
                    };
                }
            }

            let sql_statement_get = 'SELECT * FROM inc_supply_status WHERE printer_name ="' + printer.name + '"';
            db.query(sql_statement_get, function (error, sql_data) {
                if (error) return reject(error);
                if (printer.color === true) {
                    for (let x = 0; x < colors_loop_info.length; x++) {
                        let printer_name = colors_loop_info[x].inc_name;
                        printer.cartridge[printer_name].supply = {storage: sql_data[x].cartridge_supply}; //this gives error if database has no data
                    }

                } else if (printer.color === false) {
                    for (let x = 0; x < black_and_white_loop_info.length; x++) {
                        let printer_name = black_and_white_loop_info[x].inc_name;
                        printer.cartridge[printer_name].supply = {storage: sql_data[x].cartridge_supply};
                    }
                }
                return resolve(printer);
            });
        });
    }

//Parse the oids to usable data
    let session_get = (printer, oids) => {
        return new Promise((resolve, reject) => {
            let session = snmp.createSession(printer.ip, "public");
            session.get(oids, (err, data) => {
                if (err) {
                    console.log('Horses are green', err);
                    return reject(err);
                }
                printer_data_parse(printer, data).then(data => {
                    return resolve(data);
                }).catch(error => {
                    console.log('Or maby dis', error);
                    reject(error);
                });

            });
        });
    };
//Construct correct oids for printers
    return getSnmpAdresses().then( adresses =>{
        return Promise.all( adresses.map((adress)=>{
            if (adress.color === true && adress.max_capacity === false) {
                return session_get(adress, oidsArray.pr_name.concat(oidsArray.bw, colorArray));
            }
            else if (adress.color === false && adress.max_capacity === true) {
               return session_get(adress, oidsArray.pr_name.concat(oidsArray.bw, oidsArray.max_capacity_bw));
            }
            else if (adress.color === false && adress.max_capacity === false) {
                return session_get(adress, oidsArray.pr_name.concat(oidsArray.bw));
            }
            else if (adress.color === true && adress.max_capacity === true) {
                return session_get(adress, oidsArray.pr_name.concat(oidsArray.bw, colorArray, oidsArray.max_capacity_bw, oidsArray.max_capacity_color));
            }
        }));
    })
};


