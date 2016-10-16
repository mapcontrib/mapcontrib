
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/locale/presetEditColumn.ejs';


export default Marionette.LayoutView.extend({
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
        name: '#preset_name',
        description: '#preset_description',
    },

    events: {
        reset: 'onReset',
        submit: 'onSubmit',
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

        this._oldModel = this.model.clone();
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onSubmit(e) {
        e.preventDefault();

        const locales = this.model.get('locales');

        locales[this.options.locale] = {
            name: this.ui.name.val().trim(),
            description: this.ui.description.val().trim(),
        };

        this.model.set('locales', locales);

        this.model.updateModificationDate();
        this.options.theme.updateModificationDate();
        this.options.theme.save({}, {
            success: () => this.close(),

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
