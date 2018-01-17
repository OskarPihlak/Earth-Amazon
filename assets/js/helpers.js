const Handlebars = require('handlebars');
let database = require('./db.js');

module.exports.requestedPrinterJoinToResponse = (response, req) => {
    for (let i = 0; i < response.length; i++) {
        response[i].requested = req.params.id;
    }
    return response;
};

module.exports.handlebars = () => {
    Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });

    Handlebars.registerHelper('ifEquals', function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
// less than or equal to
    Handlebars.registerHelper('lessOrEquals', function (a, b) {
        let next = arguments[arguments.length - 1];
        return (a >= b) ? next.fn(this) : next.inverse(this);
    });
    Handlebars.registerHelper('testHelper', function (property) {
        return 'foo: ' + Ember.get(this, property);
    });

};

module.exports.numberOfFloors = (sql_data) => {

    let floorArray = [];
    for (let i = 0; i < sql_data.length; i++) {
        floorArray.push(sql_data[i].floor);
    }

    Array.prototype.contains = function(v) {
        for(let i = 0; i < this.length; i++) {
            if(this[i] === v) return true;
        }
        return false;
    };

    Array.prototype.unique = function() {
        let arr = [];
        for(let i = 0; i < this.length; i++) {
            if(!arr.includes(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    };

    let number_of_floors = floorArray.unique();
    return {number_of_floors :number_of_floors};
};

module.exports.pool = ()=>{
    return pool = database.db_define_database();
};

module.exports.criticalPrinters =
function criticalPrinters(response){
    let critical_printers = [];
    for (let i = 1; i < response.length; i++) {
        let toner = response[i].cartridge;
        let critical_toner_level = 25;
        if (response[i].color) {
            if (toner.black.value < critical_toner_level ||
                toner.cyan.value < critical_toner_level ||
                toner.magenta.value < critical_toner_level ||
                toner.yellow.value < critical_toner_level) {
                console.log(response[i].cartridge);
                critical_printers.push(response[i]);
            }
        } else {
            if (toner.black.value < critical_toner_level) {
                critical_printers.push(response[i]);
            }
        }
    }
    console.log(critical_printers);
    return {critical_printers: critical_printers};
};



