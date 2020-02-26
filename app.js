const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const home = require('./router/home');


//-----------Handlebar Js -----------------------------------

const handlebars = exphbs.create({
    defaultLayout: __dirname + '/views/layouts/main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        hello: function (name) {
            try{
                return "Hello " + name;
            }
            catch (e) {
                console.log(e);
            }
        },
        ifCond: function(v1, v2, options) {
            try{
                if(v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            }
            catch (e){
                console.log(e);
            }
        },
        inc: function (value, options) {
            return parseInt(value) + 1;
        }
    }
});


//--------- Register `hbs.engine` with the Express app.------

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//--------- app.enable('view cache');------------------------

app.use(express.static(path.join(__dirname, 'public')));


//--------- Parse application/json --------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//-------------Router----------------------------------------
app.use(home);


//-----------------server port-------------------------------

var server = app.listen(6969, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port);
});