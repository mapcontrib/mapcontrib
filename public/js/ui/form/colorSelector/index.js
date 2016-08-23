
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

    initialize: function () {
        this._color = this.options.color;
        this.render();
    },

    onRender: function () {
        if (this._color) {
            this._checkColor(this._color);
        }
    },

    getSelectedColor: function () {
        return this._color;
    },

    _checkColor: function (color) {
        this.ui.colorButtons
        .filter( `.${color}` )
        .find('i')
        .addClass('fa-check');
    },

    _onClickColorButtons: function (e) {
        $('i', this.ui.colorButtons).removeClass('fa-check');

        e.currentTarget.querySelector('i').classList.add('fa-check');

        this._color = e.currentTarget.dataset.color;
    },
});
