(function (module) {
    'use strict';

    var Twitter = require('../modules/twitter.js');
    var nounExtraction = require('../modules/noun-extraction.js');
    var GoogleCSE = require('../modules/google-cse.js');
    var fb = require('../modules/facebook.js');
    var async = require('async');

    module.exports = {

        validate: function (tweetId, tweetType, callback) {

            // call twitter and get text, hashtag, likes, retweets.
            // search hashtag on twitter and facebook. pick top ten articles and run sentiment analysis on it.
            // calculate the total score.
            // NLTK the tweet text and proceed.
            // based on type, search Google AND or Google - CSE
            // if we get context from CSE response, run sentiment analysis on it.
            var twitter = new Twitter();
            twitter.getTweetDetails(tweetId, function (tdError, data) {
                if (tdError) {
                    console.log(tdError);
                    return callback(tdError);
                }

                nounExtraction.getNouns(data.text, function (nounError, text) {
                    if (nounError) {
                        console.log(nounError);
                    }

                    data.refinedText = (text) ? text : data.text;

                    async.parallel([
                            function (callback) {
                                var gCSE = new GoogleCSE(data.refinedText);
                                var searchType = gCSE.SEARCH_TYPE.GENERIC;
                                if (tweetType === 'housing_land_mission') {
                                    searchType = gCSE.SEARCH_TYPE.CUSTOM;
                                }

                                gCSE.search(searchType, function (cseError, searchResults) {
                                    if (cseError) {
                                        console.log(cseError);
                                        return callback(null);
                                    }

                                    //console.log(searchResults);
                                    return callback(null, searchResults);
                                });
                            },
                            function (callback) {
                                fb.search(data.refinedText, function (fbError, fbdata) {
                                    if (fbError) {
                                        console.log(fbError);
                                        return callback(null);
                                    }

                                    console.log(fbdata);
                                    callback(null, fbdata);
                                });
                            },
                            function (callback) {
                                twitter.search(data.refinedText, function (twErr, twData) {
                                    if (twErr) {
                                        console.log(twErr);
                                        return callback();
                                    }

                                    callback(null, twData);
                                });
                            }
                        ],
                        function (error) {
                            callback(null, {
                                truth: false
                            });
                        });
                });

            });

        }

    };

})(module);