import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import Locale from 'core/locale';
import template from 'templates/admin/locale/itemMenuColumn.ejs';
import SearchList from 'ui/form/searchList';
import langs from 'langs';

export default Marionette.LayoutView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      column: {
        appendToBody: true,
        destroyOnClose: true,
        routeOnClose: this.options.routeOnClose,
        triggerRouteOnClose: this.options.triggerRouteOnClose
      }
    };
  },

  ui: {
    column: '.column',
    title: '.title'
  },

  regions: {
    list: '.rg_list'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  onRender() {
    const localeCode = this.options.locale;
    const isoInfos = langs.where('1', localeCode);
    const searchListItems = [];
    const localesCompletion = Locale.buildItemsLocaleCompletion(
      this.options.theme,
      localeCode
    );

    for (const locale of localesCompletion) {
      searchListItems.push({
        label: locale.label,
        progression: locale.completion,
        href: `#admin/locale/${localeCode}/${locale.id}`
      });
    }

    const searchLocales = new SearchList({
      items: searchListItems
    });
    this.getRegion('list').show(searchLocales);

    this.ui.title.html(isoInfos.name);
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  }
});
