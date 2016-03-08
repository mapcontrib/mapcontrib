

define([

    'marionette',
    'ui/form/nodeTags/collection',
    'ui/form/nodeTags/listItem',
],
function (

    Marionette,
    NodeTagsCollection,
    NodeTagsListItemView
) {

    'use strict';

    return Marionette.CollectionView.extend({

        childView: NodeTagsListItemView,

        childViewOptions: function () {

            return {
                'displayReadOnlyCheckboxes': this.options.displayReadOnlyCheckboxes,
            };
        },

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
