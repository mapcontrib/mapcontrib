
import Marionette from 'backbone.marionette';
import 'jquery-ui/sortable';
import 'jquery-ui-touch-punch';
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

    childViewOptions() {
        return {
            labelAttribute: this.options.labelAttribute,
            reorderable: this.options.reorderable,
            removeable: this.options.removeable,
            getIcon: model => this.options.getIcon(model),
        };
    },

    childEvents: {
        select: 'onSelectItem',
        remove: 'onRemoveItem',
    },

    initialize(options) {
        this.options = {
            ...this.defaultOptions,
            ...options,
        };
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
                update: () => this.onDnD(),
            });
        }
    },

    onDnD() {
        let i = 0;
        const sortedIdList = this.$el.sortable('toArray');

        for (const id of sortedIdList) {
            const model = this.collection.filter(
                item => item.cid === id.replace('item-', '')
            )[0];

            model.set({ order: i });

            i += 1;
        }

        this.collection.sort();

        this.trigger('reorder');
    },

    onRemoveItem(child, model) {
        this.trigger('item:remove', model);
    },

    onSelectItem(child, model) {
        this.trigger('item:select', model);
    },
});
