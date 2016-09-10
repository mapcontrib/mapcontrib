
import Marionette from 'backbone.marionette';
import jquery_ui_sortable from 'jquery-ui/sortable';
import jquery_ui_touch_punch from 'jquery-ui-touch-punch';
import EmptyView from './empty';
import ItemView from './item';


export default Marionette.CollectionView.extend({
    emptyView: EmptyView,
    childView: ItemView,

    defaultOptions: {
        placeholder: '',
        removeable: false,
        reorderable: false,
        getIcon: () => '',
    },

    emptyViewOptions() {
        return {
            placeholder: this.options.placeholder,
        };
    },

    childViewOptions(model, index) {
        return {
            reorderable: this.options.reorderable,
            removeable: this.options.removeable,
            getIcon: model => this.options.getIcon(model),
        };
    },

    childEvents: {
        select: 'onSelectItem',
    },

    initialize(options) {
        this.options = {
            ...this.defaultOptions,
            ...options
        };

        this.listenTo(this.collection, 'remove', this.onRemoveItem);
    },

    className() {
        const classes = ['list-group'];

        if (this.options.reorderable) {
            classes.push('reorderable');
        }

        if (this.options.removeable) {
            classes.push('removeable');
        }

        return classes.join(' ');
    },

    onRender() {
        if (this.options.reorderable) {
            this.$el.sortable({
                axis: 'y',
                items: 'a',
                handle: '.reorder_icon',
                update: () => this.onDnD()
            });
        }
    },

    onDnD(event) {
        let i = 0;
        const sorted_id_list = this.$el.sortable('toArray');

        for (const id of sorted_id_list) {
            const model = this.collection.filter(
                item => item.cid === id.replace('item-', '')
            )[0];

            model.set({ order: i });

            i++;
        }

        this.collection.sort();

        this.trigger('reorder');
    },

    onRemoveItem(model) {
        this.trigger('item:remove', model);
    },

    onSelectItem(e, model) {
        this.trigger('item:select', model);
    }
});
