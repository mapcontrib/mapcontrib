import Backbone from 'backbone';
import OwnerModel from '../model/owner';

export default Backbone.Collection.extend({
  model: OwnerModel
});
