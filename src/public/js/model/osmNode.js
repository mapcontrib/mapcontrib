
var _ = require('underscore');
var Backbone = require('backbone');


module.exports = Backbone.Model.extend({

    defaults: {

        'id': undefined,
        'type': 'node',
        'version': 0,
        'timestamp': new Date().toISOString(),
        'lat': undefined,
        'lng': undefined,
        'tags': [], // [{'key': '', 'value': ''}, [...]]
    }
});
