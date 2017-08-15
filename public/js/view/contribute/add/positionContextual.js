import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/contribute/add/positionContextual.ejs';
import MapUi from 'ui/map';

export default Marionette.ItemView.extend({
  template,

  behaviors: {
    l20n: {},
    contextual: {
      destroyOnClose: true,
      appendToBody: true
    }
  },

  ui: {
    nextBtn: '.next_btn',
    cancelBtn: '.cancel_btn',
    contextual: '.contextual'
  },

  events: {
    'click @ui.cancelBtn': 'onClickCancel',
    'click @ui.nextBtn': 'onClickNext'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
    this._map = this._radio.reqres.request('map');

    return this.render();
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onOpen() {
    MapUi.showContributionCross();
  },

  onBeforeClose() {
    MapUi.hideContributionCross();
  },

  onClickCancel() {
    this.options.router.navigate('');
    this.close();
  },

  onClickNext() {
    const center = this._map.getCenter();

    this.options.router.navigate(
      `contribute/add/${center.lat}/${center.lng}`,
      true
    );

    this.close();
  }
});
