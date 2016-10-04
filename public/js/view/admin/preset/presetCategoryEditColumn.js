
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import SearchList from 'ui/form/searchList';
import template from 'templates/admin/preset/presetCategoryEditColumn.ejs';


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
        bottom: '.bottom',
        name: '#category_name',
    },

    events: {
        reset: 'onReset',
        submit: 'onSubmit',
    },

    regions: {
        locales: '.rg_locales',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
        console.log(this.model);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onRender() {
        const searchLocales = new SearchList({
            items: [
                {
                    label: 'Français',
                    progression: 100,
                    href: '#',
                    callback: undefined,
                },
                {
                    label: 'Anglais',
                    progression: 65,
                    href: '#',
                    callback: undefined,
                },
                {
                    label: 'Italien',
                    progression: 40,
                    href: '#',
                    callback: undefined,
                },
            ],
        });
        this.getRegion('locales').show(searchLocales);
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onSubmit(e) {
        e.preventDefault();

        this.model.set('name', this.ui.name.val().trim());

        if (this.options.isNew) {
            this.options.theme.get('presetCategories').add( this.model );
        }

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
