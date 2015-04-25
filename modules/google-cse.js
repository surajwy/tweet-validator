/**
 * Created by suraj on 25/04/15.
 * Refer: https://developers.google.com/custom-search/json-api/v1/reference/cse/list
 */
(function (module) {
    'use strict';

    var cseConfig = require('../config/credentials.json').google;
    var google = require('googleapis');
    var cseLib = google.customsearch('v1');
    var async = require('async');

    var CSE = function (query) {
        this._query = query;
        this._type = null;
        this._apiKey = cseConfig.api_key;
    };

    CSE.prototype.search = function (type, callback) {
        var searchEngineConfig = cseConfig.engines[type];
        var searchParams = {
            auth        : this._apiKey,
            q           : this._query,
            cr          : 'countryIN',
            num         : 10,
            dateRestrict: 'y1',
            cx          : searchEngineConfig.positive_cx
        };
        var thisC = this;

        this._search(searchParams, function (error, data) {
            if (error) {
                return callback(error);
            }

            thisC._filter(data, function (error, data) {
                callback(null, data);
            });
        });
    };

    CSE.prototype._search = function _searchCB(searchParams, callback) {
        cseLib.cse.list(searchParams, function (searchErr, dataMine) {
            if (searchErr) {
                console.log(searchErr);
                return callback(searchErr);
            }

            callback(null, dataMine);
        });
    };

    //PS: Writing it in an async fashion so that we can integrate sentiment analysis for each item's snippet returned.
    CSE.prototype._filter = function _filterCB(data, callback) {
        var gold = [];

        if (!data.items) {
            return callback(null, gold);
        }

        async.each(data.items, function (item, callback) {
            var final = {
                title  : item.title,
                link   : item.link,
                snippet: item.snippet
            };
            gold.push(final);
            callback(null);
        }, function () {
            callback(null, gold);
        });
    };

    CSE.prototype.SEARCH_TYPE = {
        GENERIC: 'generic',
        CUSTOM : 'custom'
    };

    module.exports = CSE;
})(module);
