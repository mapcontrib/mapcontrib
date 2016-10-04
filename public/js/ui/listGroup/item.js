
import Marionette from 'backbone.marionette';
import template from './item.ejs';


export default Marionette.ItemView.extend({
    template,

    tagName: 'a',

    className: 'list-group-item',

    attributes: {
        href: '#',
    },

    modelEvents: {
        change: 'render',
    },

    ui: {
        reorderIcon: '.reorder_icon',
        navigateBtn: '.navigate_btn',
        removeBtn: '.remove_btn',
    },

    events: {
        click: 'onClick',
        'click @ui.navigateBtn': 'onClickNavigate',
        'click @ui.removeBtn': 'onClickRemove',
    },

    templateHelpers() {
        return {
            label: this.model.get(this.options.labelAttribute),
            leftIcon: this.options.getLeftIcon(this.model),
            rightIcon: this.options.getRightIcon(this.model),
        };
    },

    onRender() {
        if ( !this.options.reorderable ) {
            this.ui.reorderIcon.hide();
        }

        if ( !this.options.navigable ) {
            this.ui.navigateBtn.hide();
        }

        if ( !this.options.removeable ) {
            this.ui.removeBtn.hide();
        }

        this.el.id = `item-${this.model.cid}`;
    },

    onClick(e) {
        e.stopPropagation();
        e.preventDefault();

        this.trigger('select', this.model, e);
    },

    onClickNavigate(e) {
        e.stopPropagation();

        this.trigger('navigate', this.model, e);
    },

    onClickRemove(e) {
        e.stopPropagation();

        this.trigger('remove', this.model, e);
    },
});
