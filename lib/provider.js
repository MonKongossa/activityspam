// OAuthDataProvider for activity spam server
//
// Copyright 2011, 2012 StatusNet Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var _ = require('underscore'),
    App = require('../model/app').App;

var TIMELIMIT = 300; // +/- 5 min seems pretty generous

var Provider = function() {
};

_.extend(Provider.prototype, {
    applicationByConsumerKey: function(consumerKey, callback) {
	App.get(consumerKey, callback);
    },
    validateNotReplay: function(accessToken, timestamp, nonce, callback) {
        var now = Date.now()/1000,
            ts;

        try {
            ts = parseInt(timestamp, 10);
        } catch (err) {
            callback(err, null);
            return;
        }

        if (Math.abs(ts - now) > TIMELIMIT) {
            callback(null, false);
        } else {
            // FIXME: check replay of nonce
            callback(null, true);
        }
    }
});

exports.Provider = Provider;
