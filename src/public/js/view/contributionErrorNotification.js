
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/contributionErrorNotification.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'notification': {
            'destroyOnClose': true,
        },
    },

    ui: {
        'notification': '.notification',

        'content': '.content',

        'retryButton': '.retry_btn',
    },

    events: {
        'click @ui.retryButton': 'onClickRetry',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        return this.render();
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },

    onClickRetry: function () {
        this.options.retryCallback();

        this.close();
    },
});
