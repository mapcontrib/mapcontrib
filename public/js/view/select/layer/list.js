import Marionette from 'backbone.marionette';
import SelectLayerListItem from './item';

export default Marionette.CollectionView.extend({
  childView: SelectLayerListItem,

  childViewOptions() {
    return {
      router: this.options.router
    };
  },

  className: 'list-group',

  addChild(child, ChildView, index) {
    if (child.isVisible()) {
      Marionette.CollectionView.prototype.addChild.call(
        this,
        child,
        ChildView,
        index
      );
    }
  }
});
