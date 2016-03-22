
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');


module.exports = Backbone.Model.extend({

    defaults: {

        'lat': undefined,
        'lng': undefined,
        'tags': [], // [{'key': '', 'value': ''}, [...]]
    }
});
