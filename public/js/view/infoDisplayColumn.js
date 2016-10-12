
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/infoDisplayColumn.ejs';
import CONST from 'const';

export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
        column: {
            destroyOnClose: true,
            appendToBody: true,
        },
    },

    ui: {
        column: '.info_display_column',
        content: '.info_content',
        prependStickyFooter: '.sticky-inner',
        footer: '.sticky-footer',
        editBtn: '.edit_btn',
    },

    events: {
        'click @ui.editBtn': '_onClickEdit',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    templateHelpers() {
        return {
            editRoute: this.options.editRoute,
        };
    },

    onRender() {
        const layerModel = this.options.layerModel;

        this.ui.content.append( this.options.content );

        if (
            this.options.isLogged
            && layerModel.get('type') === CONST.layerType.overpass
        ) {
            this.ui.footer.removeClass('hide');
        }
        else {
            this.ui.prependStickyFooter.removeClass('sticky-inner');
        }
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    _onClickEdit() {
        this._radio.commands.execute('set:edition-data', {
            layer: this.options.layer,
            layerModel: this.options.layerModel,
        });
        this.close();
    },
});
