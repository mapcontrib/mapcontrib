import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from 'templates/admin/tag/tagEditColumn.ejs';
import TagType from 'ui/form/tagType';
import ComboFieldOptions from 'ui/form/comboFieldOptions';

export default Marionette.LayoutView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      column: {
        appendToBody: true,
        destroyOnClose: true,
        routeOnClose: this.options.routeOnClose,
        triggerRouteOnClose: this.options.triggerRouteOnClose
      }
    };
  },

  ui: {
    column: '.column',
    tagKey: '#tag_key',
    multiComboInfo1: '.multi_combo_info_1',
    multiComboInfo: '.multi_combo_info',
    keyPrefix: '.key_prefix',
    comboSection: '.combo_section',
    addOptionButton: '.add_option_btn'
  },

  events: {
    'click @ui.addOptionButton': '_onClickAddOption',
    'change @ui.tagKey': '_onChangeTagKey',
    submit: '_onSubmit',
    reset: '_onReset'
  },

  regions: {
    type: '.rg_type',
    comboOptions: '.rg_combo_options'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');

    this._oldModel = this.model.clone();
  },

  onRender() {
    this._tagType = new TagType({
      value: this.model.get('type')
    });

    this._tagType.on('change', this._onChangeTagType, this);

    this.getRegion('type').show(this._tagType);

    this._comboOptions = new ComboFieldOptions({
      options: this.model.get('options')
    });
    this.getRegion('comboOptions').show(this._comboOptions);

    this._onChangeTagKey();
    this._onChangeTagType();
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  _onSubmit(e) {
    e.preventDefault();

    const tagKey = this.ui.tagKey.val().trim();
    const tagType = this._tagType.getValue();
    const tagOptions = this._comboOptions.getOptions();

    this.model.set('key', tagKey);
    this.model.set('type', tagType);
    this.model.set('options', tagOptions);

    if (this.options.isNew) {
      this.options.theme.get('tags').add(this.model);
    }

    this.model.updateModificationDate();
    this.options.theme.updateModificationDate();
    this.options.theme.save(
      {},
      {
        success: () => {
          this.close();
        },

        error: () => {
          // FIXME
          console.error('nok');
        }
      }
    );
  },

  _onReset() {
    this.close();
  },

  _onChangeTagType() {
    const tagType = this._tagType.getValue();

    this.ui.multiComboInfo.addClass('hide');

    switch (tagType) {
      case CONST.tagType.combo:
        this.ui.comboSection.removeClass('hide');
        break;
      case CONST.tagType.typeCombo:
        this.ui.comboSection.removeClass('hide');
        break;
      case CONST.tagType.multiCombo:
        this.ui.multiComboInfo.removeClass('hide');
        this.ui.comboSection.removeClass('hide');
        break;
      default:
        this.ui.comboSection.addClass('hide');
    }
  },

  _onClickAddOption() {
    this._comboOptions.addOption();
  },

  _onChangeTagKey() {
    const key = this.ui.tagKey.val();
    const prefix = `${key}:`;

    this.ui.multiComboInfo1.html(
      document.l10n.getSync('multiComboInfo1', { prefix })
    );
  }
});
