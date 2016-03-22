
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var settings = require('../settings');


module.exports = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: settings.apiPath + 'preset',

    defaults: {

        'themeId': undefined,
        'name': undefined,
        'description': undefined,
        'order': undefined,
        'tags': [], // [{'key': '', 'value': '', 'readOnly': true}, [...]]
    },
});
