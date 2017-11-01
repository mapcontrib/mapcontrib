import Marionette from 'backbone.marionette';
import CONST from 'const';
import listItemTemplate from './listItem.ejs';
import PresetsHelper from 'helper/presets';
import KeyField from '../fields/key';
import RawKeyField from '../fields/rawKey';
import TextField from '../fields/text';

export default Marionette.LayoutView.extend({
  template: listItemTemplate,

  behaviors() {
    return {
      l20n: {}
    };
  },

  ui: {
    formGroups: '.form-group',
    displayRawTag: '.display_raw_tag',
    nonOsmCheckbox: '.non_osm_data',
    keyReadOnlyCheckbox: '.key_read_only',
    valueReadOnlyCheckbox: '.value_read_only'
  },

  regions: {
    key: '.rg_key',
    value: '.rg_value'
  },

  events: {
    'change @ui.displayRawTag': 'onChangeDisplayRawTag',
    'change @ui.nonOsmCheckbox': 'onChangeNonOsmCheckbox',
    'change @ui.keyReadOnlyCheckbox': 'onChangeKeyReadOnlyCheckbox',
    'change @ui.valueReadOnlyCheckbox': 'onChangeValueReadOnlyCheckbox'
  },

  initialize() {
    this._displayRawTag = false;

    this.listenTo(this.model.collection, 'sync', this.onCollectionUpdate);
    this.listenTo(this.model.collection, 'reset', this.onCollectionUpdate);
    this.listenTo(this.model.collection, 'update', this.onCollectionUpdate);
    this.listenTo(this.model, 'change', this._triggerCollectionUpdate);

    this._presetsHelper = new PresetsHelper(
      this.options.customTags,
      this.options.iDPresetsHelper
    );

    const fieldOptions = {
      model: this.model,
      iDPresetsHelper: this.options.iDPresetsHelper,
      customTags: this.options.customTags
    };

    this._rawKeyField = new RawKeyField(fieldOptions);
    this._localizedKeyField = new KeyField(fieldOptions);
  },

  templateHelpers() {
    return {
      cid: this.model.cid
    };
  },

  onRender() {
    this._renderKeyField();
    this._renderValueField();

    this.ui.nonOsmCheckbox.prop('checked', this.model.get('nonOsmData'));
    this.ui.keyReadOnlyCheckbox.prop('checked', this.model.get('keyReadOnly'));
    this.ui.valueReadOnlyCheckbox.prop(
      'checked',
      this.model.get('valueReadOnly')
    );
    this.ui.displayRawTag.prop('checked', this._displayRawTag);

    this._setNonOsmIfFileTagType();
    this._changeKeyReadOnlyStateIfNeeded();

    this.onCollectionUpdate();
  },

  _renderKeyField() {
    if (this._keyField) {
      this._keyField.off('change', this._renderValueField);
    }

    if (this._displayRawTag) {
      this._keyField = this._rawKeyField;
    } else {
      this._keyField = this._localizedKeyField;
    }

    this._keyField.on('change', this._renderValueField, this);
    this._keyField.on('change', this._setNonOsmIfFileTagType, this);
    this.getRegion('key').show(this._keyField, { preventDestroy: true });
  },

  _renderValueField() {
    const fieldOptions = {
      model: this.model,
      iDPresetsHelper: this.options.iDPresetsHelper,
      customTags: this.options.customTags,
      placeholder: document.l10n.getSync('defaultValue')
    };

    if (this._displayRawTag) {
      this._valueField = new TextField(fieldOptions);
    } else {
      this._valueField = this._presetsHelper.buildValueField(
        this.model.get('key'),
        this.model.get('value'),
        fieldOptions
      );
    }

    this.getRegion('value').show(this._valueField);
  },

  onCollectionUpdate() {
    const osmTags = this.model.collection.where({
      nonOsmData: false
    });

    if (this._valueField) {
      if (osmTags.length > 1) {
        this._valueField.enableRemoveBtn();
      } else {
        this._valueField.disableRemoveBtn();
      }
    }
  },

  onChangeDisplayRawTag() {
    this._displayRawTag = this.ui.displayRawTag.prop('checked');
    this._renderKeyField();
    this._renderValueField();
  },

  onChangeNonOsmCheckbox() {
    const nonOsmChecked = this.ui.nonOsmCheckbox.prop('checked');

    this.model.set('nonOsmData', nonOsmChecked);

    this._changeKeyReadOnlyStateIfNeeded();
  },

  onChangeKeyReadOnlyCheckbox() {
    this.model.set('keyReadOnly', this.ui.keyReadOnlyCheckbox.prop('checked'));
  },

  onChangeValueReadOnlyCheckbox() {
    const valueReadOnlyChecked = this.ui.valueReadOnlyCheckbox.prop('checked');

    this.model.set('valueReadOnly', valueReadOnlyChecked);

    this._changeKeyReadOnlyStateIfNeeded();
  },

  _changeKeyReadOnlyStateIfNeeded() {
    if (this.model.get('nonOsmData') || this.model.get('valueReadOnly')) {
      this.ui.keyReadOnlyCheckbox.prop('checked', true).prop('disabled', true);

      this.model.set('keyReadOnly', true);
    } else {
      this.ui.keyReadOnlyCheckbox.prop('disabled', false);
    }
  },

  _setNonOsmIfFileTagType() {
    const tagType = this._presetsHelper.findTagType(this.model.get('key'));

    if (tagType === CONST.tagType.file) {
      this.ui.nonOsmCheckbox.prop('checked', true).prop('disabled', true);
    } else {
      this.ui.nonOsmCheckbox.prop('disabled', false);
    }

    this.onChangeNonOsmCheckbox();
  },

  _triggerCollectionUpdate() {
    this.model.collection.trigger('update');
  }
});
