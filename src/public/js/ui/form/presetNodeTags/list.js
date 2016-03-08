

define([

    'marionette',
    'ui/form/presetNodeTags/collection',
    'ui/form/presetNodeTags/listItem',
],
function (

    Marionette,
    PresetNodeTagsCollection,
    PresetNodeTagsListItemView
) {

    'use strict';

    return Marionette.CollectionView.extend({

        childView: PresetNodeTagsListItemView,

        setTags: function (tags) {

            this.collection = new PresetNodeTagsCollection( tags );

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
