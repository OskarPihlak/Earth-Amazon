let mysql = require('mysql');

module.exports.db_define_database = () => {
    pool = mysql.createPool({
        connectionLimit: 10,
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'printers_inc_supply',
        insecureAuth: true
    });
    return pool;
};


