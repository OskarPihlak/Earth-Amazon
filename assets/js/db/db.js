let mysql = require('mysql');

module.exports.db_define_database = () => {
    pool = mysql.createPool({
        connectionLimit: 30,
        host: '127.0.0.1',
        user: 'printers',
        password: 'printers',
        database: 'printers_inc_supply',
        insecureAuth: true
    });
    return pool;
};


