import Backbone from 'backbone';
import CONST from '../const';

export default Backbone.Model.extend({
  idAttribute: 'fragment',

  urlRoot: `${CONST.apiPath}/userTheme`,

  defaults() {
    return {
      fragment: undefined,
      name: undefined,
      color: undefined
    };
  }
});
