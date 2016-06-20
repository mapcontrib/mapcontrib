
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/editPoiMenuColumn.ejs';
import MovePoiContextual from './movePoiContextual';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    ui: {
        'column': '#user_column',
        'editTagsItem': '.edit_tags_item',
        'moveItem': '.move_item',
    },

    events: {
        'click @ui.editTagsItem': 'onClickEditTags',
        'click @ui.moveItem': 'onClickMove',
    },

    initialize: function (options) {
        this._radio = Wreqr.radio.channel('global');

        this._user = options.user;
        this._mapData = options.mapData;
        this._osmElement = options.osmElement;
        this._layerModel = options.layerModel;
    },

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },

    onClickEditTags: function (e) {
        e.preventDefault();

        this._radio.commands.execute(
            'editPoiData',
            this._osmElement,
            this._layerModel
        );
    },

    onClickMove: function (e) {
        e.preventDefault();

        let marker = this._mapData.getMarkersFromOsmElement(
            this._osmElement,
            this._layerModel.cid
        )[0];

        let movePoiContextual = new MovePoiContextual({
            'user': this._user,
            'marker': marker,
            'osmElement': this._osmElement,
            'layerModel': this._layerModel,
        });

        movePoiContextual.open();
        this.close();
    },
});
