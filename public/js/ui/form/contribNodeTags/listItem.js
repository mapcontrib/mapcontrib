
import Marionette from 'backbone.marionette';
import CONST from 'const';
import listItemTemplate from './listItem.ejs';
import { formatBytes, basename } from 'core/utils';
import KeyField from '../fields/key';
import RawKeyField from '../fields/rawKey';
import TextField from '../fields/text';
import NumberField from '../fields/number';
import FileField from '../fields/file';


export default Marionette.LayoutView.extend({
    template: listItemTemplate,

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
    },

    templateHelpers() {
        return {
            cid: this.model.cid,
        };
    },

    onRender() {
        document.l10n.localizeNode( this.el );

        this._renderKeyField();
        this._renderValueField();

        if (this.model.get('nonOsmData')) {
            this.ui.nonOsmWarning.removeClass('hide');
        }

        this.ui.displayRawTag.prop('checked', this._displayRawTag);

        this.onCollectionUpdate();
    },

    _renderKeyField() {
        const fieldOptions = {
            model: this.model,
            iDPresetsHelper: this.options.iDPresetsHelper,
        };

        if (this._displayRawTag) {
            this._keyField = new RawKeyField( fieldOptions );
        }
        else {
            this._keyField = new KeyField( fieldOptions );
        }

        this._keyField.on('change', this._renderValueField, this);
        this.getRegion('key').show( this._keyField );

        if (this.model.get('keyReadOnly')) {
            this._keyField.disable();
        }
    },

    _renderValueField() {
        const fieldOptions = {
            model: this.model,
            iDPresetsHelper: this.options.iDPresetsHelper,
        };

        if (this._displayRawTag) {
            this._valueField = new TextField( fieldOptions );
        }
        else {
            switch (this.model.get('type')) {
                case 'text':
                    this._valueField = new TextField( fieldOptions );
                    break;
                case 'number':
                    this._valueField = new NumberField( fieldOptions );
                    break;
                case 'file':
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
        else {
            this._valueField.setFocus();
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
            nonOsmData: false
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

    onChangeDisplayRawTag(e) {
        this._displayRawTag = this.ui.displayRawTag.prop('checked');
        this._renderKeyField();
        this._renderValueField();
    },
});
