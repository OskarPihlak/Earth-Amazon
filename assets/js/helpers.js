const Handlebars = require('handlebars');
let database = require('./db.js');
const pool = database.db_define_database();

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

module.exports.arrayToObjectArray = function toObject(array) {
    let object_array = [];
    for (let i = 0; i < array.length; ++i) {
        object_array.push({cartridge: array[i]});
    }
    return object_array;
};

module.exports.printerStorageSorting = (toner_storage, sql_data, selected_storage, selected_toner) => {

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

module.exports.storageSorting = (sql_data, selected_storage, error) => {
    let toner_storage = exports.arrayToObjectArray(exports.uniqueCartridges(sql_data).unique_array);
    let sorted_storage = exports.printerStorageSorting(toner_storage, sql_data, selected_storage);
    if (error) {
        throw error;
    }

    let selected_toners = [];
    for (let i = 0; i < sorted_storage.length; i++) {
        for (let x = 0; x < (sorted_storage[i].printers).length; x++) {
            if ((sorted_storage[i].printers[x]) === sorted_storage[i].selected_printer) {
                selected_toners.push(sorted_storage[i].cartridge)
            }
        }
    }
    for (let i = 0; i < sorted_storage.length; i++) {
        sorted_storage[i].selected_toner = selected_toners;
    }
    return sorted_storage;
};

module.exports.criticalPrinters = (response)=> {
    let critical_printers = [];
    console.log(response,'response');

    for (let i = 0; i < response.length; i++) {
        let toner = response[i].cartridge;
        console.log(toner);
        let critical_toner_level = 15;
        if (response[i].color) {
            if (toner.black.value < critical_toner_level ||
                toner.cyan.value < critical_toner_level ||
                toner.magenta.value < critical_toner_level ||
                toner.yellow.value < critical_toner_level) {
                critical_printers.push(response[i]);
            }
        } else {
            if (toner.black.value < critical_toner_level) {
                critical_printers.push(response[i]);
            }
        }

    }
    return critical_printers;
};

module.exports.uniqueArray = (data)=>{
    Array.prototype.unique = function (data) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            if (!arr.includes(data[i])) {
                arr.push(data[i]);
            }
        }
        return arr;
    }
};


module.exports.uniquePrinterNames = ()=> {
    Array.prototype.unique = function () {
        let arr = [];
        for (let i = 0; i < this.length; i++) {
            if (!arr.includes(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    };
};
module.exports.isEmpty = (obj)=> {
        // Speed up calls to hasOwnProperty
        let hasOwnProperty = Object.prototype.hasOwnProperty;
        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (let key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };



