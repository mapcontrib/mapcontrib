
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');


module.exports = Marionette.ItemView.extend({

    template: require('../../templates/editPresetListEmpty.ejs'),
});
