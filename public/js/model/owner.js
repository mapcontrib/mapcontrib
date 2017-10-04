import Backbone from 'backbone';

export default Backbone.Model.extend({
  idAttribute: '_id',

  defaults() {
    return {
      _id: undefined,
      osmId: undefined,
      displayName: undefined,
      avatar: undefined
    };
  }
});
