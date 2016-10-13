
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/locale/menuColumn.ejs';
import SearchList from 'ui/form/searchList';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    ui: {
        column: '.column',
    },

    regions: {
        locales: '.rg_locales',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
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

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },
});
