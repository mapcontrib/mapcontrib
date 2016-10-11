
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        label: '',
        description: '',
        leftIcon: '',
        rightIcon: '',
        progress: 0,
        href: '#',
        callback: undefined,
    },
});
