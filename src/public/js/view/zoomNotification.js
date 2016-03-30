
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/zoomNotification.ejs';


export default Marionette.LayoutView.extend({

    template: template,

    behaviors: {

        'l20n': {},
        'notification': {},
    },

    ui: {

        'notification': '#zoom_notification',

        'content': '.content',
    },

    initialize: function () {

        this._radio = Wreqr.radio.channel('global');
    },

    open: function () {

        this.triggerMethod('open');
    },

    close: function () {

        this.triggerMethod('close');
    },
});
