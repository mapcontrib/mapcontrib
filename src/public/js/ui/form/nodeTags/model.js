

define([

    'backbone',
],
function (

    Backbone
) {

    'use strict';

    return Backbone.Model.extend({

        defaults: {

            'key': undefined,
            'value': undefined,
            'keyReadOnly': true,
            'valueReadOnly': true,
        },
    });
});
