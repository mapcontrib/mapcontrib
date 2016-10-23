
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        key: '',
        value: '',
        options: [],
        keyReadOnly: false,
        valueReadOnly: false,
        nonOsmData: false,
    },
});
