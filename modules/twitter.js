(function (module) {
    'use strict';

    var Tw = require('twitter');
    var config = require('../config/credentials.json');
    var logger = require('../helper/logger.js');

    var Twitter = function () {
        this._twitterClient = new Tw(config.twitter);
    };

    Twitter.prototype.getTweetDetails = function (tweetId, callback) {

        this._twitterClient.get('statuses/show.json', {id: tweetId}, function (error, mine) {

            if (error) {
                console.log('[statuses/show] error', error);
                return callback(error);
            }

            if (!mine) {
                console.log('No tweet information for tweetId = ' + tweetId);
                return callback('No tweet information for tweetId');
            }

            var gold = {
                text          : mine.text,
                favoriteCount : mine.favorite_count || 0,
                retweetCount  : mine.retweet_count || 0,
                isUserVerified: (mine.user && mine.user.verified === true),
                hashtags      : []
            };

            // hashtags
            if (mine.entities && mine.entities.hashtags) {
                mine.entities.hashtags.forEach(function (hashtag) {
                    gold.hashtags.push(hashtag.text);
                });
            }

            return callback(null, gold);
        });

    };

    Twitter.prototype.search = function (text, callback) {
        this._twitterClient.get('search/tweets', {q: text}, function(error, data){
            if(error){
                console.log(error);
                return callback(error);
            }

            //console.log(data);
            callback(null, data);
        });
    };

    module.exports = Twitter;

})(module);