let mysql = require('mysql');


module.exports.db_create_connection = ()=>{
    db = mysql.createPool({
        connectionLimit: 100,
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'printers_inc_supply',
        insecureAuth : true
    });
    return db;
};
exports.db_create_connection();

module.exports.db_connect = ()=> {
    exports.db_create_connection();
    db.getConnection(function (err, connection){
        console.log(connection);
        if (err) throw err;
        console.log('Mysql connected to printers_inc_supply on 127.0.0.1');
        return connection;
    });
};


