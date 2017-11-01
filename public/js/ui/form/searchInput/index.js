import Marionette from 'backbone.marionette';
import template from './template.ejs';
import './style.less';
import WidgetUi from 'ui/widget';

export default Marionette.LayoutView.extend({
  template,
  className: 'ui-input-search-wrapper',

  ui: {
    input: 'input',
    icon: '.icon',
    spinner: '.spinner'
  },

  events: {
    'keyup @ui.input': 'onKeyUp',
    'focus @ui.input': 'onFocus'
  },

  templateHelpers() {
    return {
      placeholder: this.options.placeholder
    };
  },

  initialize() {
    this._timeout = null;

    this._options = {
      ...{
        charactersMin: 3,
        placeholder: ''
      },
      ...this.options
    };

    this.on('search:success', this.hideSpinner);
    this.on('search:error', this.hideSpinner);
  },

  onDestroy() {
    this.off('search:success');
    this.off('search:error');
  },

  setFocus() {
    WidgetUi.setFocus(this.ui.input);
  },

  onFocus() {
    this.trigger('focus');
  },

  onKeyUp() {
    this.trigger('keyup');

    const searchString = this.ui.input.val();
    const charactersCount = this.ui.input.val().length;

    if (this._lastSearchedString === searchString) {
      return true;
    }

    this._lastSearchedString = searchString;

    clearTimeout(this._timeout);

    if (charactersCount === 0) {
      this.hideSpinner();
      this.trigger('empty');
    } else if (
      charactersCount > 0 &&
      charactersCount < this._options.charactersMin
    ) {
      this.hideSpinner();
      this.trigger('notEnoughCharacters', searchString);
    } else {
      this.trigger('search:before', searchString);
      this.showSpinner();

      this._timeout = setTimeout(
        this.trigger.bind(this, 'search', searchString),
        300
      );
    }

    return true;
  },

  showSpinner() {
    this.ui.icon.addClass('hide');
    this.ui.spinner.removeClass('hide');
  },

  hideSpinner() {
    this.ui.spinner.addClass('hide');
    this.ui.icon.removeClass('hide');
  }
});
