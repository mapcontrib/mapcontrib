
import Marionette from 'backbone.marionette';
import ThemeThumbListItemView from './listItem';


export default Marionette.CollectionView.extend({
    childView: ThemeThumbListItemView,

    className: 'row',
});
