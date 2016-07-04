
import Marionette from 'backbone.marionette';
import template from '../../templates/infoDisplayFullscreen.ejs';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'fullpage': {
            'appendToBody': true,
        },
    },

    ui: {
        'fullpage': '.info_display_fullscreen',
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
