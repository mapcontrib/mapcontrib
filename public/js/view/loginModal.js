
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/loginModal.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
        'modal': {
            'appendToBody': true
        },
    },

    ui: {
        'modal': '#login_modal',
    },

    templateHelpers() {
        return {
            'successRedirect': this.options.authSuccessCallback,
            'failureRedirect': this.options.authFailCallback,
        };
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
