const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const snmp = require("net-snmp");
const bodyParser = require('body-parser');
let ProgressBar = require('progressbar.js');

const printer_data = require('./assets/js/printer-data.js');

//app init
let app = express();

app.use(express.static(path.join(__dirname, 'assets')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//templating engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//main page route
printer_data((error, data)=> {
    app.get('/', function (req, res) {

        res.render('main', {
            printers:data
        });
    });
});

app.set('port', (process.env.PORT) || 3000);
app.listen(app.get('port'),  function () {
    console.log('Server started on port' + app.get('port'))
});