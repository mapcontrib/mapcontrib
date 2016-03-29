
var Marionette = require('backbone.marionette');
var NavPillsStackedCollection = require('./collection');
var NavPillsStackedListItemView = require('./listItem');


module.exports = Marionette.CompositeView.extend({

    template: require('./list.ejs'),

    childView: NavPillsStackedListItemView,

    childViewContainer: 'ul',

    setItems: function (items) {

        this.collection = new NavPillsStackedCollection( items );

        this.render();
    }
});
