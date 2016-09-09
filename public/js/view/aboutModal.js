
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/aboutModal.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors() {
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

    templateHelpers() {
        const aboutTextVersion = document.l10n.getSync(
            'aboutTextVersion',
            { 'version': this.options.version }
        );

        return {
            aboutTextVersion,
        };
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
});
