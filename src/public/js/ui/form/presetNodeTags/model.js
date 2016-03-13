

define([

    'backbone',
],
function (

    Backbone
) {

    'use strict';

    return Backbone.Model.extend({

        defaults: {

            'key': '',
            'value': '',
            'keyReadOnly': true,
            'valueReadOnly': false,
        },
    });
});
