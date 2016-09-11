
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/userColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors() {
        return {
            'l20n': {},
            'column': {
                'appendToBody': true,
                'destroyOnClose': true,
                'routeOnClose': this.options.previousRoute,
            },
        };
    },

    ui: {
        'column': '.column',
        'logoutItem': '.logout_item',
    },

    events: {
        'click @ui.logoutItem': 'close',
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
