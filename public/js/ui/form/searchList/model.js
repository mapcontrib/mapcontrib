
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        'label': '',
        'description': '',
        'href': '#',
        'callback': undefined,
    },
});
