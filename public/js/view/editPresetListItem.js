
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/editPresetListItem.ejs';


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

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        this.el.id = 'preset-'+ this.model.cid;
    },

    onClick() {
        this._radio.commands.execute( 'column:showPresetTags', this.model );
    },

    onClickRemove(e) {
        e.stopPropagation();

        this.model.destroy();
        this._radio.commands.execute('theme:save');
    },
});
