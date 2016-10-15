
import Marionette from 'backbone.marionette';
import ContribNodeTagsCollection from './collection';
import ContribNodeTagsListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: ContribNodeTagsListItemView,

    childViewOptions() {
        return {
            iDPresetsHelper: this.options.iDPresetsHelper,
            customTags: this.options.customTags,
        };
    },

    initialize(options) {
        this.collection = new ContribNodeTagsCollection();

        if (options.tags && options.tags.length > 0) {
            this.collection.add(options.tags);
        }
    },

    addTag(tag) {
        if ( tag === false ) {
            return false;
        }

        if ( typeof tag === 'undefined' ) {
            return this.collection.add({});
        }

        if (tag.key) {
            const currentTag = this.collection.findWhere({ key: tag.key });

            if (currentTag) {
                return currentTag.set(tag);
            }
        }

        return this.collection.add(tag);
    },

    getTags() {
        return this.collection.toJSON();
    },

    hasFileToUpload() {
        let hasFileToUpload = false;

        for (const i in this.children._views) {
            if ({}.hasOwnProperty.call(this.children._views, i)) {
                const fileTag = this.children._views[i];

                if ( fileTag.isFileTag() && fileTag.valueIsNotEmpty() ) {
                    hasFileToUpload = true;
                }
            }
        }

        return hasFileToUpload;
    },

    showErrorFeedback(response) {
        for (const i in this.children._views) {
            if ({}.hasOwnProperty.call(this.children._views, i)) {
                const view = this.children._views[i];
                const modelId = response.fileInput.replace('fileInput_', '');

                if (view.model.cid === modelId) {
                    view.showErrorFeedback();
                }
            }
        }
    },

    hideErrorFeedbacks() {
        for (const i in this.children._views) {
            if ({}.hasOwnProperty.call(this.children._views, i)) {
                const view = this.children._views[i];

                view.hideErrorFeedback();
            }
        }
    },

    setFilesPathFromApiResponse(apiResponse) {
        for (const file of apiResponse) {
            const key = Object.keys(file)[0];
            const modelId = key.replace('fileInput_', '');
            const path = file[key];

            for (const i in this.children._views) {
                if ({}.hasOwnProperty.call(this.children._views, i)) {
                    const view = this.children._views[i];

                    if (view.model.cid === modelId) {
                        view.model.set('value', path);
                    }
                }
            }
        }
    },
});
