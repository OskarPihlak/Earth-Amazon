module.exports.cartridge_add = (ip, printer_name, printer_color, pool) => {
    const colors_in_color_printer = 4;
    const colors_in_bw_printer = 1;
    const snmp = require("net-snmp");
    let colorsArray = [];
    const oidsArray = {
        bw_cartridge_name: ["1.3.6.1.2.1.43.11.1.1.6.1.1"],        //black name
        colors: {
            cyan_cartridge_name: "1.3.6.1.2.1.43.11.1.1.6.1.2",     //cyan name
            magenta_cartridge_name: "1.3.6.1.2.1.43.11.1.1.6.1.3",     //magenta name
            yellow_cartridge_name: "1.3.6.1.2.1.43.11.1.1.6.1.4",     //yellow name
        },
    };
    Object.keys(oidsArray.colors).map(function (key) {
        colorsArray.push(oidsArray.colors[key]);
    });

    function printer_name_parse(printer, data) {
        return new Promise((resolve, reject) => {
            if (printer_color === 'true') {
                for (let i = 0; i < colors_in_color_printer; i++) {
                    let sql_statement_post_cartridge = `INSERT INTO printers_inc_supply.inc_supply_status SET printer_name='${printer_name}', cartridge_name='${(data[i].value).toString()}', cartridge_supply=0;`;
                    console.log(sql_statement_post_cartridge);
                    pool.getConnection((err, connection) => {
                        connection.query(sql_statement_post_cartridge, function (error, result) {
                        console.log(result);
                        });
                        connection.release();
                    });
                }
            } else {
                let sql_statement_post_cartridge = `INSERT INTO printers_inc_supply.inc_supply_status SET printer_name='${printer_name}', cartridge_name='${(data[0].value).toString()}', cartridge_supply=0;`;
                console.log(sql_statement_post_cartridge);
                pool.getConnection((err, connection) => {
                    connection.query(sql_statement_post_cartridge, function (error, result) {
                        if (error) {throw error;}
                        console.log(result);
                    });
                    connection.release();
                });
            }
        });
    }

    let session_get = (ip, oids) => {
        return new Promise((resolve, reject) => {
            let session = snmp.createSession(ip, "public");
            session.get(oids, (err, data) => {
                if (err) {
                    return reject(err);
                }
                printer_name_parse(ip, data);
            });
        });
    };

    if (printer_color === 'true') {
        let toner_names = oidsArray.bw_cartridge_name.concat(colorsArray);
        session_get(ip, toner_names);
    } else {
        let toner_names = oidsArray.bw_cartridge_name;
        session_get(ip, toner_names);
    }
};