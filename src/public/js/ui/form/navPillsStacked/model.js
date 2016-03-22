
'use strict';


var Backbone = require('backbone');


module.exports = Backbone.Model.extend({

    defaults: {

        'label': '',
        'description': '',
        'href': '#',
        'callback': undefined,
    },
});
