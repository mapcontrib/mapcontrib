

define([

    'marionette',
    'ui/form/contribNodeTags/collection',
    'ui/form/contribNodeTags/listItem',
],
function (

    Marionette,
    ContribNodeTagsCollection,
    ContribNodeTagsListItemView
) {

    'use strict';

    return Marionette.CollectionView.extend({

        childView: ContribNodeTagsListItemView,

        setTags: function (tags) {

            this.collection = new ContribNodeTagsCollection( tags );

            if (tags.length === 0) {

                this.collection.add({});
            }

            this.render();
        },

        addTag: function () {

            this.collection.add({});
        },

        getTags: function () {

            return this.collection.toJSON();
        },
    });
});
