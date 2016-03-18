
'use strict';


var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');


module.exports = Marionette.ItemView.extend({

    template: JST['editPresetListEmpty.html'],
});
