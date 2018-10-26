import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from 'templates/admin/locale/tagEditColumn.ejs';
import templateOption from 'templates/admin/locale/tagOption.ejs';
import templateValue from 'templates/admin/locale/tagValue.ejs';

export default Marionette.LayoutView.extend({
  template,
  templateOption,
  templateValue,

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
    addValueBtn: '.add_value_btn',
    removeValueBtn: '.remove_value_btn',
    optionsSection: '.options_section',
    valuesWrapper: '.values_wrapper',
    valuesSection: '.values_section'
  },

  events: {
    'click @ui.addValueBtn': 'onClickAddValueBtn',
    'click @ui.removeValueBtn': 'onClickRemoveValueBtn',
    submit: 'onSubmit',
    reset: 'onReset'
  },

  templateHelpers() {
    const attributes = this.model.get('locales')[this.options.locale] || {};

    return {
      key: attributes.key || ''
    };
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');

    this._oldModel = this.model.clone();
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
  },

  onRender() {
    switch (this.model.get('type')) {
      case CONST.tagType.combo:
      case CONST.tagType.typeCombo:
        // case CONST.tagType.multiCombo:
        this._renderOptions();
        break;
      default:
        this._renderValues();
    }
  },

  _renderOptions() {
    const key = this.model.get('key');
    const options = this.model.get('options');
    const attributes = this.model.get('locales')[this.options.locale] || {};
    let optionHtml = '';

    for (const option of options) {
      const inputId = this._buildId(key, option, this.model.cid);
      const optionLabel = option;
      let value = '';

      // if (this.model.get('type') === CONST.tagType.multiCombo) {
      //     optionLabel = `${key}:${option}`;
      // }

      if (attributes.options && attributes.options[option]) {
        value = attributes.options[option];
      }

      optionHtml += this.templateOption({
        id: inputId,
        label: optionLabel,
        value
      });
    }

    this.ui.optionsSection.html(optionHtml);
  },

  _renderValues() {
    const { values } = this.model.get('locales')[this.options.locale] || {
      values: {}
    };
    let valueHtml = '';

    if (values) {
      for (const label of Object.keys(values)) {
        valueHtml += this.templateValue({
          label,
          value: values[label]
        });
      }
    }

    if (!valueHtml) {
      valueHtml += this.templateValue({
        label: '',
        value: ''
      });
    }

    this.ui.valuesSection.html(valueHtml);
    this.ui.valuesWrapper.removeClass('hide');
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  _buildId(key, option, cid) {
    return `${key}_${option}_${cid}`.replace(/\W/g, '_');
  },

  onClickAddValueBtn() {
    this.ui.valuesSection.append(
      this.templateValue({
        label: '',
        value: ''
      })
    );

    document.l10n.localizeNode(this.ui.valuesSection[0]);
    this.bindUIElements();
  },

  onClickRemoveValueBtn(e) {
    $(e.target)
      .parents('.form-group')
      .remove();
  },

  onSubmit(e) {
    e.preventDefault();

    const key = this.model.get('key');
    const options = this.model.get('options');
    const locales = this.model.get('locales');
    const locale = {
      key: this.ui.tagKey.val().trim(),
      options: {},
      values: {}
    };

    switch (this.model.get('type')) {
      case CONST.tagType.combo:
      case CONST.tagType.typeCombo:
        // case CONST.tagType.multiCombo:
        for (const option of options) {
          const inputId = this._buildId(key, option, this.model.cid);
          const value = this.el.querySelector(`#${inputId}`).value;
          locale.options[option] = value;
        }
        break;
      default:
        this.ui.valuesSection.find('.value_group').map((index, group) => {
          const label = group.querySelector('.value_label').value;
          const value = group.querySelector('.value_value').value;

          if (label) {
            locale.values[label] = value;
          }
        });
    }

    locales[this.options.locale] = locale;
    this.model.set('locales', locales);

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
          console.error('nok'); // eslint-disable-line
        }
      }
    );
  },

  onReset() {
    this.close();
  }
});
