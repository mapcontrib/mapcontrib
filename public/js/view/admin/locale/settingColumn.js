
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/locale/settingColumn.ejs';


export default Marionette.ItemView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.routeOnClose,
                triggerRouteOnClose: this.options.triggerRouteOnClose,
            },
        };
    },

    ui: {
        column: '.column',

        themeName: '#theme_name',
        themeDescription: '#theme_description',
    },

    events: {
        submit: 'onSubmit',
        reset: 'onReset',
    },

    templateHelpers() {
        const attributes = this.model.get('locales')[this.options.locale];

        return {
            name: attributes ? attributes.name : '',
            description: attributes ? attributes.description : '',
        };
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

    onSubmit(e) {
        e.preventDefault();

        const locales = this.model.get('locales');

        locales[this.options.locale] = {
            name: this.ui.themeName.val(),
            description: this.ui.themeDescription.val(),
        };

        this.model.set('locales', locales);
        this.model.updateModificationDate();

        this.model.save({}, {
            success: () => {
                this.close();
            },
            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },

    onReset() {
        this.close();
    },
});
