
import Marionette from 'backbone.marionette';
import CONST from 'const';
import listItemTemplate from './listItem.ejs';
import KeyField from '../fields/key';
import RawKeyField from '../fields/rawKey';
import TextField from '../fields/text';
import NumberField from '../fields/number';
import FileField from '../fields/file';


export default Marionette.LayoutView.extend({
    template: listItemTemplate,

    behaviors() {
        return {
            l20n: {},
        };
    },

    ui: {
        formGroups: '.form-group',
        nonOsmWarning: '.non_osm_warning',
        displayRawTag: '.display_raw_tag',
    },

    regions: {
        key: '.rg_key',
        value: '.rg_value',
    },

    events: {
        'change @ui.displayRawTag': 'onChangeDisplayRawTag',
    },

    initialize() {
        this._displayRawTag = false;

        this.listenTo(this.model.collection, 'sync', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'reset', this.onCollectionUpdate);
        this.listenTo(this.model.collection, 'update', this.onCollectionUpdate);

        const fieldOptions = {
            model: this.model,
            iDPresetsHelper: this.options.iDPresetsHelper,
            customTags: this.options.customTags,
        };

        this._rawKeyField = new RawKeyField( fieldOptions );
        this._localizedKeyField = new KeyField( fieldOptions );
    },

    templateHelpers() {
        return {
            cid: this.model.cid,
        };
    },

    onRender() {
        this._renderKeyField();
        this._renderValueField();

        if (this.model.get('nonOsmData')) {
            this.ui.nonOsmWarning.removeClass('hide');
        }

        this.ui.displayRawTag.prop('checked', this._displayRawTag);

        this.onCollectionUpdate();
    },

    _renderKeyField() {
        if (this._keyField) {
            this._keyField.off('change', this._renderValueField);
        }

        if (this._displayRawTag) {
            this._keyField = this._rawKeyField;
        }
        else {
            this._keyField = this._localizedKeyField;
        }

        this._keyField.on('change', this._renderValueField, this);
        this.getRegion('key').show(this._keyField, { preventDestroy: true });

        if (this.model.get('keyReadOnly')) {
            this._keyField.disable();
        }
    },

    _renderValueField() {
        const fieldOptions = {
            model: this.model,
            iDPresetsHelper: this.options.iDPresetsHelper,
            customTags: this.options.customTags,
        };

        if (this._displayRawTag) {
            this._valueField = new TextField( fieldOptions );
        }
        else {
            switch (this.model.get('type')) {
                case CONST.tagType.text:
                    this._valueField = new TextField( fieldOptions );
                    break;
                case CONST.tagType.number:
                    this._valueField = new NumberField( fieldOptions );
                    break;
                case CONST.tagType.file:
                    this._valueField = new FileField( fieldOptions );
                    break;
                default:
                    this._valueField = new TextField( fieldOptions );
            }
        }

        this.getRegion('value').show( this._valueField );

        if (this.model.get('valueReadOnly')) {
            this._valueField.disable();
        }

        if (this.model.get('keyReadOnly') || this.model.get('valueReadOnly')) {
            this._valueField.disableRemoveBtn();
        }

        if (this.model.get('nonOsmData')) {
            this._valueField.disableRemoveBtn();
        }
    },

    onCollectionUpdate() {
        if (this.model.get('keyReadOnly') || this.model.get('valueReadOnly')) {
            return;
        }

        if ( this.model.get('nonOsmData') ) {
            return;
        }

        const osmTags = this.model.collection.where({
            nonOsmData: false,
        });

        if (osmTags.length === 1) {
            this._valueField.disableRemoveBtn();
        }
        else {
            this._valueField.enableRemoveBtn();
        }
    },

    isFileTag() {
        if ( this.model.get('type') === CONST.tagType.file ) {
            return true;
        }

        return false;
    },

    valueIsNotEmpty() {
        return this._valueField.isNotEmpty();
    },

    showErrorFeedback() {
        this.ui.formGroups.addClass('has-feedback has-error');
    },

    hideErrorFeedback() {
        this.ui.formGroups.removeClass('has-feedback has-error');
    },

    onChangeDisplayRawTag() {
        this._displayRawTag = this.ui.displayRawTag.prop('checked');
        this._renderKeyField();
        this._renderValueField();
    },
});
