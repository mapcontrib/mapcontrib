
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/conflictModal.ejs';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'modal': {},
    },

    ui: {
        'modal': '#conflict_modal',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    close: function () {
        this.triggerMethod('close');
    },
});
