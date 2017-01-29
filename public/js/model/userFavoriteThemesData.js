
import Backbone from 'backbone';

export default Backbone.Model.extend({
    idAttribute: 'fragment',

    defaults() {
        return {
            fragment: undefined,
            name: undefined,
            color: undefined,
        };
    },
});
