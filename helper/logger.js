(function (module) {
    'use strict';

    var winston = require('winston');
    var logger = new (winston.Logger)({
        transports       : [
            new (winston.transports.Console)({json: true, timestamp: true}),
            new winston.transports.File({filename: __dirname + '/logs/debug.log', json: true})
        ],
        exceptionHandlers: [
            new (winston.transports.Console)({json: true, timestamp: true}),
            new winston.transports.File({filename: __dirname + '/logs/exceptions.log', json: true})
        ],
        exitOnError      : false
    });

    module.exports = logger;

})(module);