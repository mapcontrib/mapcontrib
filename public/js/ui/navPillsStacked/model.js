
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        label: '',
        description: '',
        progress: 0,
        href: '#',
        callback: undefined,
    },
});
