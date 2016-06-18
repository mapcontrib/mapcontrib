
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from '../../templates/editPresetListItem.ejs';


export default Marionette.ItemView.extend({
    template: template,

    tagName: 'a',

    className: 'list-group-item',

    attributes: {
        'href': '#',
    },

    modelEvents: {
        'change': 'render'
    },

    ui: {
        'remove_btn': '.remove_btn'
    },

    events: {
        'click': 'onClick',
        'click @ui.remove_btn': 'onClickRemove',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender: function () {
        this.el.id = 'preset-'+ this.model.cid;
    },

    onClick: function () {
        this._radio.commands.execute( 'column:showPresetTags', this.model );
    },

    onClickRemove: function (e) {
        e.stopPropagation();

        this.model.destroy();
        this._radio.commands.execute('theme:save');
    },
});
