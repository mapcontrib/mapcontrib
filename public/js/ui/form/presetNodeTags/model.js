
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        key: '',
        value: '',
        keyReadOnly: false,
        valueReadOnly: false,
        nonOsmData: false,
    },
});
