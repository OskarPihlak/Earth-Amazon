let mysql = require('mysql');


module.exports.db_create_connection = ()=>{
    db = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'printers_inc_supply'
    });
    return db;
};

module.exports.db_connect = ()=> {

    exports.db_create_connection();
    db.connect(function (err) {
        if (err) throw err;
        console.log('Mysql connected to printers_inc_supply on 127.0.0.1');
    });
};


