
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/aboutModal.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: function () {
        return {
            'l20n': {},
            'modal': {
                'appendToBody': true,
                'routeOnClose': this.options.previousRoute,
            },
        };
    },

    ui: {
        'modal': '#about_modal',
    },

    templateHelpers: function () {
        const aboutTextVersion = document.l10n.getSync(
            'aboutTextVersion',
            { 'version': this.options.version }
        );

        return {
            aboutTextVersion,
        };
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },
});
