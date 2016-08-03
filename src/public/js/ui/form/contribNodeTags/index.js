
import Marionette from 'backbone.marionette';
import CONST from '../../../const';
import ContribNodeTagsCollection from './collection';
import ContribNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: ContribNodeTagsListItemView,

    initialize: function () {
        this.collection = new ContribNodeTagsCollection();
    },

    setTags: function (tags) {
        if (tags.length === 0) {
            this.collection.add({
                'keyReadOnly': false,
                'valueReadOnly': false,
                'nonOsmData': false,
                'type': CONST.tagType.text,
            });
        }
        else {
            this.collection.add( tags );
        }

        this.render();
    },

    addTag: function (tag) {
        if ( !tag ) {
            tag = {
                'keyReadOnly': false,
                'valueReadOnly': false,
                'nonOsmData': false,
                'type': CONST.tagType.text,
            };
        }

        this.collection.add( tag );
    },

    getTags: function () {
        return this.collection.toJSON();
    },

    hasFileToUpload: function () {
        let hasFileToUpload = false;

        for (const i in this.children._views) {
            const fileTag = this.children._views[i];

            if ( fileTag.isFileTag() && fileTag.isNotEmpty() ) {
                hasFileToUpload = true;
            }
        }

        return hasFileToUpload;
    },

    showErrorFeedback: function (response) {
        for (const i in this.children._views) {
            const view = this.children._views[i];
            const modelId = response.fileInput.replace('fileInput_', '');

            if (view.model.cid === modelId) {
                view.showErrorFeedback();
            }
        }
    },

    hideErrorFeedbacks: function () {
        for (const i in this.children._views) {
            const view = this.children._views[i];

            view.hideErrorFeedback();
        }
    },

    setFilesPathFromApiResponse: function (apiResponse) {
        for (const file of apiResponse) {
            const key = Object.keys(file)[0];
            const modelId = key.replace('fileInput_', '');
            const path = file[key];

            for (const i in this.children._views) {
                const view = this.children._views[i];

                if (view.model.cid === modelId) {
                    view.model.set('value', path);
                }
            }
        }
    },
});
