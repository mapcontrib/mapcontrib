

define([

    'backbone.marionette',
    './collection',
    './listItem',
],
function (

    Marionette,
    NavPillsStackedCollection,
    NavPillsStackedListItemView
) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: JST['ui/form/navPillsStacked/list.html'],

        childView: NavPillsStackedListItemView,

        childViewContainer: 'ul',

        setItems: function (items) {

            this.collection = new NavPillsStackedCollection( items );

            this.render();
        }
    });
});
