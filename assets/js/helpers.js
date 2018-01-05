const Handlebars = require('handlebars');

module.exports.requestedPrinterJoinToResponse = (response, req) => {
    for(let i=0; i<response.length; i++){
        response[i].requested = req.params.id;
    }
    return response;
};

module.exports.handlebars = ()=>{
    Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
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

    Handlebars.registerHelper('ifEquals', function(a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
// less than or equal to
    Handlebars.registerHelper('lessOrEquals', function( a, b ){
        let next =  arguments[arguments.length-1];
        return (a >= b) ? next.fn(this) : next.inverse(this);
    });
    Handlebars.registerHelper('testHelper', function(property) {
        return 'foo: ' + Ember.get(this, property);
    });

};

