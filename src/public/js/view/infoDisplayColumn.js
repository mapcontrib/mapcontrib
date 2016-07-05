
import Marionette from 'backbone.marionette';
import template from '../../templates/infoDisplayColumn.ejs';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {
            'destroyOnClose': true,
            'appendToBody': true,
        },
    },

    ui: {
        'column': '.info_display_column',
        'content': '.info_content',
        'footer': '.sticky-footer',
        'editBtn': '.edit_btn',
    },

    events: {
        'click @ui.editBtn': 'close',
    },

    onRender: function () {
        this.ui.content.append( this.options.content );

        if (this.options.layerModel.get('dataEditable')) {
            this.ui.footer.removeClass('hide');
        }
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },
});
