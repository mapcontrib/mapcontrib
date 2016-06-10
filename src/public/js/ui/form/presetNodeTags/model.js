
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        'key': '',
        'value': '',
        'keyReadOnly': true,
        'valueReadOnly': false,
    },
});
