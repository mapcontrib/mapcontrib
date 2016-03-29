
var Backbone = require('backbone');
var NavPillsStackedModel = require('./model');


module.exports = Backbone.Collection.extend({

    model: NavPillsStackedModel,
});
