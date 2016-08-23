
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/visitorColumn.ejs';
import LoginModalView from './loginModal';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    ui: {
        'column': '#visitor_column',
        'loginItem': '.login_item',
    },

    events: {
        'click @ui.loginItem': 'onClickLogin',
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

    onClickLogin() {
        // FIXME To have a real fail callback
        let authSuccessCallback = this.options.theme.buildPath();
        let authFailCallback = this.options.theme.buildPath();

        new LoginModalView({
            'authSuccessCallback': authSuccessCallback,
            'authFailCallback': authFailCallback
        }).open();
    },
});
