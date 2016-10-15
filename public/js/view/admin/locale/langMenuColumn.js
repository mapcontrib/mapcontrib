
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import Locale from 'core/locale';
import template from 'templates/admin/locale/langMenuColumn.ejs';
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
        const searchListItems = [];
        const localesCompletion = Locale.buildLocalesCompletion(this.options.theme);

        for (const locale of localesCompletion) {
            searchListItems.push({
                label: locale.label,
                description: locale.description.ucfirst(),
                progression: locale.completion,
                href: `#admin/locale/${locale.code}`,
            });
        }

        const searchLocales = new SearchList({
            items: searchListItems,
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
