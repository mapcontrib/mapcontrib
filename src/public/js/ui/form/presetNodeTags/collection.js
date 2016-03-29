
var Backbone = require('backbone');
var PresetNodeTagsModel = require('./model');


module.exports = Backbone.Collection.extend({

    model: PresetNodeTagsModel,
});
