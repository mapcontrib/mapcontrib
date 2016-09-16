
import Backbone from 'backbone';
import CONST from 'const';


export default Backbone.Model.extend({
    defaults: {
        key: '',
        value: '',
        keyReadOnly: true,
        valueReadOnly: false,
        nonOsmData: false,
        type: CONST.tagType.text,
    },
});
