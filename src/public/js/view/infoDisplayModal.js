
import Marionette from 'backbone.marionette';
import template from '../../templates/infoDisplayModal.ejs';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'modal': {
            'appendToBody': true,
        },
    },

    ui: {
        'modal': '.info_display_modal',
        'content': '.info_content',
        'editBtn': '.edit_btn',
    },

    events: {
        'click @ui.editBtn': 'close',
    },

    onRender: function () {
        this.ui.content.append( this.options.content );
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },
});
