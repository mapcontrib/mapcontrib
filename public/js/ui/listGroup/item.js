import Marionette from 'backbone.marionette';
import template from './item.ejs';
import ProgressBar from 'progressbar.js';
import CONST from 'const';

export default Marionette.ItemView.extend({
  template,

  tagName: 'a',

  className: 'list-group-item',

  attributes: {
    href: '#'
  },

  modelEvents: {
    change: 'render'
  },

  ui: {
    reorderIcon: '.reorder_icon',
    navigateBtn: '.navigate_btn',
    removeBtn: '.remove_btn',
    progression: '.progression'
  },

  events: {
    click: 'onClick',
    'click @ui.navigateBtn': 'onClickNavigate',
    'click @ui.removeBtn': 'onClickRemove'
  },

  templateHelpers() {
    return {
      label: this.model.get(this.options.labelAttribute),
      leftIcon: this.options.getLeftIcon(this.model),
      rightIcon: this.options.getRightIcon(this.model)
    };
  },

  onRender() {
    if (!this.options.reorderable) {
      this.ui.reorderIcon.hide();
    }

    if (!this.options.navigable) {
      this.ui.navigateBtn.hide();
    }

    if (!this.options.removeable) {
      this.ui.removeBtn.hide();
    }

    this.el.id = `item-${this.model.cid}`;

    let progression = this.options.progression;

    if (this.options.getProgression) {
      progression = this.options.getProgression(this.model);
    }

    if (progression >= 0) {
      this._progressCircle = new ProgressBar.Circle(this.ui.progression[0], {
        trailWidth: 14,
        strokeWidth: 14,
        trailColor: 'rgba(255, 255, 255, 0.2)'
      });

      // If I use the set method instead of the animate one,
      // Chromium doesn't use the step callback...
      this._progressCircle.animate(progression / 100 || 0, {
        easing: 'easeInOut',
        duration: 1000,
        step: (state, circle) => {
          const progress = circle.value() * 100;

          if (progress >= 100) {
            circle.path.setAttribute('stroke', '#8AE234');
          } else if (progress < 100 && progress > 50) {
            circle.path.setAttribute('stroke', '#FCE94F');
          } else {
            circle.path.setAttribute('stroke', '#EF2929');
          }
        }
      });

      this.ui.progression
        .attr('title', `${progression} %`)
        .tooltip({
          container: 'body',
          delay: {
            show: CONST.tooltip.showDelay,
            hide: CONST.tooltip.hideDelay
          }
        })
        .removeClass('hide');
    }
  },

  onClick(e) {
    e.stopPropagation();
    e.preventDefault();

    this.trigger('select', this.model, e);
  },

  onClickNavigate(e) {
    e.stopPropagation();
    e.preventDefault();

    this.trigger('navigate', this.model, e);
  },

  onClickRemove(e) {
    e.stopPropagation();
    e.preventDefault();

    this.trigger('remove', this.model, e);
  }
});
