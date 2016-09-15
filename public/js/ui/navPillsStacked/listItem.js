
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

        const bar = new ProgressBar.Circle(this.ui.progression[0], {
            easing: 'easeInOut',
            duration: 1400,
            trailWidth: 14,
            strokeWidth: 14,
            trailColor: 'rgba(255, 255, 255, 0.2)',
            color: '#eee',
            from: { color: '#F8DC00', a: 1 },
            to: { color: '#8AE234', a: 1 },
            step: (state, circle) => {
                circle.path.setAttribute('stroke', state.color);
            },
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

        bar.set(progression / 100 || 0);
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
