
import Marionette from 'backbone.marionette';
import ProgressBar from 'progressbar.js';
import MarkedHelper from 'helper/marked';
import CONST from 'const';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    tagName: 'li',

    attributes: {
        role: 'presentation',
    },

    ui: {
        link: '.top_link',
        description: '.description',
        progression: '.progression',
    },

    events: {
        'click @ui.link a': 'onClickInnerLink',
        'click @ui.link': 'onClick',
    },

    onRender() {
        const description = this.model.get('description');

        if ( description ) {
            this.ui.description.html(
                MarkedHelper.render( description )
            )
            .removeClass('hide');
        }

        if (this.model.get('progression') >= 0) {
            this._progressCircle = new ProgressBar.Circle(this.ui.progression[0], {
                trailWidth: 14,
                strokeWidth: 14,
                trailColor: 'rgba(255, 255, 255, 0.2)',
            });

            const progression = this.model.get('progression');

            this.ui.progression
            .attr('title', `${progression} %`)
            .tooltip({
                container: 'body',
                delay: {
                    show: CONST.tooltip.showDelay,
                    hide: CONST.tooltip.hideDelay,
                },
            })
            .removeClass('hide');
        }
    },

    onShow() {
        if (this.model.get('progression') >= 0) {
            const progression = this.model.get('progression');

            this._progressCircle.animate(
                progression / 100 || 0,
                {
                    easing: 'easeInOut',
                    duration: 1400,
                    step: (state, circle) => {
                        const progress = circle.value() * 100;

                        if (progress >= 100) {
                            circle.path.setAttribute('stroke', '#8AE234');
                        }
                        else if (progress < 100 && progress > 50) {
                            circle.path.setAttribute('stroke', '#FCE94F');
                        }
                        else {
                            circle.path.setAttribute('stroke', '#EF2929');
                        }
                    },
                }
            );
        }
    },

    onClick(e) {
        if ( this.ui.link.attr('href') === '#' ) {
            e.preventDefault();
        }

        const callback = this.model.get('callback');

        if (callback) {
            callback();
        }
    },

    onClickInnerLink(e) {
        e.stopPropagation();
    },
});
