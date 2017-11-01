import Backbone from 'backbone';
import CONST from 'const';

export default Backbone.Model.extend({
  defaults: {
    key: '',
    value: '',
    options: [],
    keyReadOnly: false,
    valueReadOnly: false,
    nonOsmData: false,
    type: CONST.tagType.text
  }
});
