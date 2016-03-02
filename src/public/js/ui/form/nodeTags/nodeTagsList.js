

define([

    'marionette',
    'ui/form/nodeTags/nodeTagsCollection',
    'ui/form/nodeTags/nodeTagsListEmpty',
    'ui/form/nodeTags/nodeTagsListItem',
],
function (

    Marionette,
    NodeTagsCollection,
    NodeTagsListEmptyView,
    NodeTagsListItemView
) {

    'use strict';

    return Marionette.CollectionView.extend({

        childView: NodeTagsListItemView,

        emptyView: NodeTagsListEmptyView,

        setTags: function (tags) {

            this.collection = new NodeTagsCollection( tags );

            if (tags.length === 0) {

                this.collection.add({});
            }

            this.render();
        },
    });
});
