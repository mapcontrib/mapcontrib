import Marionette from 'backbone.marionette';
import 'jquery-ui/sortable';
import 'jquery-ui-touch-punch';
import EmptyView from './empty';
import ItemView from './item';
import './style.less';

export default Marionette.CollectionView.extend({
  emptyView: EmptyView,
  childView: ItemView,

  defaultOptions: {
    placeholder: '',
    removeable: false,
    reorderable: false,
    navigable: false,
    progression: undefined,
    getProgression: undefined,
    getLeftIcon: () => '',
    getRightIcon: () => ''
  },

  emptyViewOptions() {
    return {
      placeholder: this.options.placeholder
    };
  },

  childViewOptions() {
    return {
      labelAttribute: this.options.labelAttribute,
      reorderable: this.options.reorderable,
      navigable: this.options.navigable,
      removeable: this.options.removeable,
      progression: this.options.progression,
      getProgression: model => {
        if (this.options.getProgression) {
          return this.options.getProgression(model);
        }

        return undefined;
      },
      getLeftIcon: model => this.options.getLeftIcon(model),
      getRightIcon: model => this.options.getRightIcon(model)
    };
  },

  childEvents: {
    select: 'onSelectItem',
    navigate: 'onNavigateItem',
    remove: 'onRemoveItem'
  },

  initialize(options) {
    this.options = {
      ...this.defaultOptions,
      ...options
    };
  },

  className() {
    const classes = ['list-group', 'append-xs-none'];

    if (this.options.reorderable) {
      classes.push('reorderable');
    }

    if (this.options.navigable) {
      classes.push('navigable');
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
        items: '.list-group-item',
        handle: '.reorder_icon',
        update: () => this.onDnD()
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

  onRemoveItem(child, model, e) {
    this.trigger('item:remove', model, e);
  },

  onSelectItem(child, model, e) {
    this.trigger('item:select', model, e);
  },

  onNavigateItem(child, model, e) {
    this.trigger('item:navigate', model, e);
  },

  countItems() {
    return this.collection.length;
  }
});
