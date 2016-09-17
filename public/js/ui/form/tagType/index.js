
import Marionette from 'backbone.marionette';
import template from './template.ejs';


export default Marionette.LayoutView.extend({
    template,

    tagName: 'select',
    className: 'form-control',

    behaviors() {
        return {
            l20n: {},
        };
    },

    onRender() {
        if (this.options.value) {
            this.$el.val(this.options.value);
        }
    },

    getValue() {
        return this.$el.val();
    },
});
