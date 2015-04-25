(function (module) {
    'use strict';

    var pyShell = require('python-shell');
    module.exports = {

        getNouns: function (rawText, callback) {
            callback(null, rawText);
            return;
            pyShell.run('chunky.py', {
                scriptPath   : './../ext/',
                pythonOptions: ['-i'],
                args         : [rawText]
            }, function (error, data) {
                return callback(error, data);
            });
        }
    };

})(module);