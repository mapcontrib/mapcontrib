
'use strict';


var Marionette = require('backbone.marionette');
var JST = require('../../../../templates/templates');
var NavPillsStackedCollection = require('./collection');
var NavPillsStackedListItemView = require('./listItem');


module.exports = Marionette.CompositeView.extend({

    template: JST['ui/form/navPillsStacked/list.html'],

    childView: NavPillsStackedListItemView,

    childViewContainer: 'ul',

    setItems: function (items) {

        this.collection = new NavPillsStackedCollection( items );

        this.render();
    }
});
