/**
 * Created by suraj on 25/04/15.
 */

(function (module) {
    'use strict';

    var FB = require('fb');
    var config = require('../config/credentials.json');
    FB.options({
        appId:          config.facebook.appId,
        appSecret:      config.facebook.appSecret,
    });
    module.exports = {

        search: function (text, callback) {

            FB.api(text, function (res) {
                if (!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return callback(res.error);
                }
                console.log(res.id);
                console.log(res.name);
            });
        }
    };

})(module);
