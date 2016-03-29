
var L20n = require('l20n');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');


module.exports = Marionette.Behavior.extend({

    onRender: function () {

        document.l10n.localizeNode( this.el );
    },
});
