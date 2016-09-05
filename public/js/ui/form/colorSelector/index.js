
import Marionette from 'backbone.marionette';
import template from './template.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    className: 'form-group',

    ui: {
        'colorButtons': '.color-buttons .btn',
    },

    events: {
        'click @ui.colorButtons': '_onClickColorButtons',
    },

    initialize() {
        this._color = this.options.color;
        this.render();
    },

    onRender() {
        if (this._color) {
            this._checkColor(this._color);
        }
    },

    getSelectedColor() {
        return this._color;
    },

    _checkColor(color) {
        this.ui.colorButtons
        .filter( `.${color}` )
        .find('i')
        .addClass('fa-check');
    },

    _onClickColorButtons(e) {
        $('i', this.ui.colorButtons).removeClass('fa-check');

        e.currentTarget.querySelector('i').classList.add('fa-check');

        this._color = e.currentTarget.dataset.color;
    },
});
