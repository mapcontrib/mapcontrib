
import Marionette from 'backbone.marionette';
import template from 'templates/404Root.ejs';

export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
    },
});
