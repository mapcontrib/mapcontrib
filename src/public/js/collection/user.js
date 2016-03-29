
var _ = require('underscore');
var Backbone = require('backbone');
var settings = require('../settings');
var UserModel = require('../model/user');


module.exports = Backbone.Collection.extend({

    url: settings.apiPath + 'user',

    model: UserModel,

    comparator: 'displayName',
});
