
import Marionette from 'backbone.marionette';
import CONST from '../../../const';
import ContribNodeTagsCollection from './collection';
import ContribNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: ContribNodeTagsListItemView,

    childViewOptions(model, index) {
        return {
            iDPresetsHelper: this.options.iDPresetsHelper
        };
    },

    initialize() {
        this.collection = new ContribNodeTagsCollection();
    },

    setTags(tags) {
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

    addTag(tag) {
        if ( !tag ) {
            return this.collection.add({
                'keyReadOnly': false,
                'valueReadOnly': false,
                'nonOsmData': false,
                'type': CONST.tagType.text,
            });
        }

        if (tag.key) {
            const currentTag = this.collection.findWhere({ key: tag.key });

            if (currentTag) {
                return currentTag.set(tag);
            }
        }

        this.collection.add(tag);
    },

    getTags() {
        return this.collection.toJSON();
    },

    hasFileToUpload() {
        let hasFileToUpload = false;

        for (const i in this.children._views) {
            const fileTag = this.children._views[i];

            if ( fileTag.isFileTag() && fileTag.valueIsNotEmpty() ) {
                hasFileToUpload = true;
            }
        }

        return hasFileToUpload;
    },

    showErrorFeedback(response) {
        for (const i in this.children._views) {
            const view = this.children._views[i];
            const modelId = response.fileInput.replace('fileInput_', '');

            if (view.model.cid === modelId) {
                view.showErrorFeedback();
            }
        }
    },

    hideErrorFeedbacks() {
        for (const i in this.children._views) {
            const view = this.children._views[i];

            view.hideErrorFeedback();
        }
    },

    setFilesPathFromApiResponse(apiResponse) {
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
