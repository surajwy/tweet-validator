(function (module) {
    'use strict';

    var Express = require('express');
    var app = Express();
    var morgan = require('morgan');
    var routes = require('./routes');

    var logger = require('./helper/logger.js');
    var fs = require('fs');


    // Access logs.
    app.use(morgan('combined', {stream: fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'})}));

    // Initialize the routes.
    routes.init(app);


    app.listen(3000);
})(module);