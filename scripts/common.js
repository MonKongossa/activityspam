// common.js
//
// Common utilities for activityspam scripts
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

var url = require('url'),
    http = require('http'),
    config = require('./config'),
    OAuth = require('oauth').OAuth,
    _ = require('underscore');

var postActivity = function(serverUrl, activity, callback) {

    var req, oa, parts, toSend, pair;

    if (!callback) {
        callback = postReport(activity);
    }
    
    parts = url.parse(serverUrl);

    if (!_(config).has('hosts') ||
        !_(config.hosts).has(parts.hostname)) {
        callback(new Error("No OAuth key for " + parts.hostname), null);
        return;
    }

    pair = config.hosts[parts.hostname];

    oa = new OAuth(null, // request token N/A for 2-legged OAuth
                   null, // access token N/A for 2-legged OAuth
                   pair.key,
                   pair.secret,
                   "1.0",
                   null,
                   "HMAC-SHA1",
                   null, // nonce size; use default
                   {"User-Agent": "activityspam/0.1"});
    
    toSend = JSON.stringify(activity);

    oa.post(serverUrl, null, null, toSend, 'application/json', function(err, data, response) {
        // Our callback has swapped args to OAuth module's
        callback(err, response, data);
    });
};

var postReport = function(activity) {
    return function(err, res, body) {
        if (err) {
            console.log("Error posting activity " + activity.id);
            console.error(err);
        } else {
            console.log("Results of posting " + activity.id + ": " + body);
        }
    };
};

exports.postActivity = postActivity;
exports.postReport = postReport;
