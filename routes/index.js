(function (module) {
    'use strict';

    var domain = require('domain');
    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json({type: 'application/json'});
    var tweetValidator = require('../models/tweet-validation.js');

    module.exports = {
        init: function (app) {

            app.post('/validate', jsonParser, function (req, res) {

                res.setHeader('Content-Type', 'application/json');

                var tweetId = req.body.tweet_id || null;
                var tweetType = req.body.tweetType || null;

                if (!tweetId) {
                    res.statusCode = 400;
                    res.json({
                        error_code   : 1001,
                        error_message: 'tweet_id required.'
                    });
                    res.end();
                    return;
                }

                tweetValidator.validate(tweetId, tweetType, function(error, result){
                    res.statusCode = 200;
                    res.json({truth: result.truth});
                    res.end();
                });

            });

        }
    };

})(module);