import Marionette from 'backbone.marionette';
import NavPillsStacked from 'ui/navPillsStacked';
// import SearchInput from 'ui/form/searchInput';
import template from './template.ejs';

export default Marionette.LayoutView.extend({
  template,

  regions: {
    searchInput: '.rg_search_input',
    nav: '.rg_nav'
  },

  initialize(options) {
    this._navPillsStacked = new NavPillsStacked({
      items: options.items
    });
  },

  onRender() {
    // this.getRegion('searchInput').show(
    //     new SearchInput()
    // );

    this.getRegion('nav').show(this._navPillsStacked);
  }
});
