
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

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        return this.render();
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onClickRetry() {
        this.options.retryCallback();

        this.close();
    },
});
