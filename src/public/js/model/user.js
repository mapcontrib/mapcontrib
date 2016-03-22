
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var settings = require('../settings');


module.exports = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: settings.apiPath + 'user',

    defaults: {

        'osmId': undefined,
        'displayName': undefined,
        'avatar': undefined,
        'token': undefined,
        'tokenSecret': undefined,
    }
});
