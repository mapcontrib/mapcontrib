
'use strict';


var Backbone = require('backbone');
var ContribNodeTagsModel = require('./model');


module.exports = Backbone.Collection.extend({

    model: ContribNodeTagsModel,
});
