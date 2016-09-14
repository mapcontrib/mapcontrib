
import Marionette from 'backbone.marionette';
import ProgressBar from 'progressbar.js';
import MarkedHelper from 'helper/marked';
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
        progress: '.progression',
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

        const progress = this.model.get('progress') / 100 || 0.05;

        if (progress) {
            const bar = new ProgressBar.Circle(this.ui.progress[0], {
                easing: 'easeInOut',
                duration: 1400,
                trailWidth: 8,
                strokeWidth: 8,
                trailColor: 'rgba(255, 255, 255, 0.15)',
                color: '#eee',
                from: { color: '#eee' },
                to: { color: '#fff' },
                step: (state, circle) => {
                    circle.path.setAttribute('stroke', state.color);
                },
            });

            this.ui.progress.removeClass('hide');
            bar.set(progress);
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
