
import Marionette from 'backbone.marionette';
import template from './template.ejs';
import './style.less';

export default Marionette.LayoutView.extend({
    template: template,

    ui: {
        'input': 'input',
        'icon': '.icon',
        'spinner': '.spinner',
    },

    events: {
        'keyup @ui.input': 'onKeyUp',
    },

    templateHelpers() {
        return {
            placeholder: this.options.placeholder,
        };
    },

    initialize(options) {
        this._timeout = null;

        this.options = {
            ...{
                placeholder: '',
            },
            ...options
        }
    },

    onRender() {
        this.setFocus();
    },

    setFocus() {
        this.ui.input.focus();
    },

    onKeyUp(e) {
        const searchString = this.ui.input.val();
        const charactersCount = this.ui.input.val().length;

        if ( this._lastSearchedString === searchString ) {
            return true;
        }

        this._lastSearchedString = searchString;

        clearTimeout(this._timeout);

        if (charactersCount === 0) {
            this.hideSpinner();
            this.trigger('empty');
        }
        else if (charactersCount > 0 && charactersCount < 3) {
            this.hideSpinner();
            this.trigger('notEnoughCharacters', searchString);
        }
        else {
            this.showSpinner();
            this.trigger('search', searchString);

            this._timeout = setTimeout(
                this.search.bind(this, searchString),
                300
            );
        }
    },

    search(searchString) {
        this.options.onSearch(searchString)
            .then(this.hideSpinner.bind(this))
            .catch(this.hideSpinner.bind(this));
    },

    showSpinner() {
        this.ui.icon.addClass('hide');
        this.ui.spinner.removeClass('hide');
    },

    hideSpinner() {
        this.ui.spinner.addClass('hide');
        this.ui.icon.removeClass('hide');
    },
});
