
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/zoomNotification.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
        'notification': {},
    },

    ui: {
        'notification': '#zoom_notification',

        'content': '.content',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    disappear() {
        this.ui.notification.addClass('disappear');
    },

    appear() {
        this.ui.notification.removeClass('disappear');
    },
});
