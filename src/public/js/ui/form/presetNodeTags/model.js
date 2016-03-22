
'use strict';


var Backbone = require('backbone');


module.exports = Backbone.Model.extend({

    defaults: {

        'key': '',
        'value': '',
        'keyReadOnly': true,
        'valueReadOnly': false,
    },
});
