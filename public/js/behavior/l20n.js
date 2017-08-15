import Marionette from 'backbone.marionette';

export default Marionette.Behavior.extend({
  onRender() {
    document.l10n.localizeNode(this.el);
  }
});
