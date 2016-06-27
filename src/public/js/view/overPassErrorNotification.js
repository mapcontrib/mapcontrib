
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/overPassErrorNotification.ejs';


export default Marionette.ItemView.extend({
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
        'error': '.error',
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

    onRender: function () {
        this.ui.content.html(

            document.l10n.getSync('overpassErrorNotification_content', { 'name': this.model.get('name') })
        );

        this.ui.error.html(`«&nbsp;${this.options.error}&nbsp;»`);
    },
});