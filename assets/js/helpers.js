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

    Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

        var operators, result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });

};

module.exports.numberOfFloors = (sql_data) => {

    let floorArray = [];
    for (let i = 0; i < sql_data.length; i++) {
        floorArray.push(sql_data[i].floor);
    }

    Array.prototype.contains = function (v) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] === v) return true;
        }
        return false;
    };

    Array.prototype.unique = function () {
        let arr = [];
        for (let i = 0; i < this.length; i++) {
            if (!arr.includes(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    };

    let number_of_floors = floorArray.unique();
    return {number_of_floors: number_of_floors};
};

module.exports.pool = () => {
    return pool = database.db_define_database();
};

module.exports.criticalPrinters =
    function criticalPrinters(response) {
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
        return {critical_printers: critical_printers};
    };

module.exports.uniqueCartridges = (sql_data) => {
    let elementArray = [];
    for (let i = 0; i < sql_data.length; i++) {
        elementArray.push(sql_data[i].cartridge_name);
    }

    Array.prototype.contains = function (v) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] === v) return true;
        }
        return false;
    };

    Array.prototype.unique = function () {
        let arr = [];
        for (let i = 0; i < this.length; i++) {
            if (!arr.includes(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    };
    let unique_array = (elementArray).unique();
    return {unique_array: unique_array};
};

module.exports.arrayToObjectArray =  function toObject(array) {
    let object_array = [];
    for (let i = 0; i < array.length; ++i){
        object_array.push({cartridge: array[i]});}
    return object_array;
};

module.exports.printerStorageSorting = (toner_storage, sql_data,selected_storage, selected_toner)=>{

    for (let i = 0; i < toner_storage.length; i++) {
        toner_storage[i].printers = [];
        for (let y = 0; y < sql_data.length; y++) {

            if (toner_storage[i].cartridge === sql_data[y].cartridge_name) {
                (toner_storage[i].printers).push(sql_data[y].printer_name);
                toner_storage[i].storage = sql_data[y].cartridge_supply;
                toner_storage[i].selected_printer = selected_storage;
            }
        }
    }
    return toner_storage;
};


