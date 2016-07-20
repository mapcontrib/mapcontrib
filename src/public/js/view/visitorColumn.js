
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

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },

    onClickLogin: function () {
        // FIXME To have a real fail callback
        let authSuccessCallback = this.options.theme.buildPath();
        let authFailCallback = this.options.theme.buildPath();

        new LoginModalView({
            'authSuccessCallback': authSuccessCallback,
            'authFailCallback': authFailCallback
        }).open();
    },
});
