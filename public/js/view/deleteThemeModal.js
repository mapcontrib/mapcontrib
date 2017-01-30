
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/deleteThemeModal.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
        modal: {
            appendToBody: true,
        },
    },

    ui: {
        modal: '#delete_theme_modal',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },
});
