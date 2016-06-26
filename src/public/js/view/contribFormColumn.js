
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import ContribNodeTagsListView from '../ui/form/contribNodeTags';
import NewPoiPlacementContextual from './newPoiPlacementContextual';
import template from '../../templates/contribFormColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    regions: {
        'tagList': '.rg_tag_list',
    },

    ui: {
        'column': '#contrib_form_column',
        'content': '.content',
        'addBtn': '.add_btn',
    },

    events: {
        'click @ui.addBtn': 'onClickAddBtn',
        'submit': 'onSubmit',
    },

    initialize: function (options) {
        this._radio = Wreqr.radio.channel('global');
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

    onRender: function () {
        this._tagList = new ContribNodeTagsListView();

        if (this.options.presetModel) {
            this._tagList.setTags(this.options.presetModel.get('tags'));
        }
        else {
            this._tagList.setTags([]);
        }

        this.getRegion('tagList').show( this._tagList );
    },

    onClickAddBtn: function () {
        this._tagList.addTag();

        let scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },

    onSubmit: function (e) {
        e.preventDefault();

        this.close();

        let newPoiPlacementContextual = new NewPoiPlacementContextual({
            'tags': this._tagList.getTags(),
            'user': this.options.user,
            'contribFormColumn': this,
        });

        newPoiPlacementContextual.open();
    },
});
