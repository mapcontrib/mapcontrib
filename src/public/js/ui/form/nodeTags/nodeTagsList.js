

define([

    'marionette',
    'ui/form/nodeTags/nodeTagsCollection',
    'ui/form/nodeTags/nodeTagsListItem',
],
function (

    Marionette,
    NodeTagsCollection,
    NodeTagsListItemView
) {

    'use strict';

    return Marionette.CollectionView.extend({

        childView: NodeTagsListItemView,

        setTags: function (tags) {

            this.collection = new NodeTagsCollection( tags );

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
