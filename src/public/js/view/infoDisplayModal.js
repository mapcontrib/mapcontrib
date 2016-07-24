
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/infoDisplayModal.ejs';
import CONST from '../const';

export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'modal': {
            'appendToBody': true,
        },
    },

    ui: {
        'modal': '.info_display_modal',
        'content': '.info_content',
        'editBtn': '.edit_btn',
        'footer': '.sticky-footer',
    },

    events: {
        'click @ui.editBtn': 'close',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender: function () {
        const layerModel = this.options.layerModel;

        this.ui.content.append( this.options.content );

        if (
            layerModel.get('dataEditable')
            && this.options.isLogged
            && layerModel.get('type') === CONST.layerType.overpass
        ) {
            this.ui.editBtn.on( 'click', this.options.editAction );
            this.ui.footer.removeClass('hide');
        }
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },
});
