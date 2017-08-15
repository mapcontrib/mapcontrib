import Marionette from 'backbone.marionette';
import ThemeThumbListItemView from './listItem';
import './style.less';

export default Marionette.CollectionView.extend({
  childView: ThemeThumbListItemView,

  className: 'row'
});
