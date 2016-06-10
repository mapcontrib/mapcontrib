
import Marionette from 'backbone.marionette';
import marked from 'marked';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    tagName: 'li',

    attributes: {
        'role': 'presentation',
    },

    ui: {
        'link': 'a',
    },

    events: {
        'click @ui.link': 'onClick'
    },

    templateHelpers: function () {
        return {
            'description': marked( this.model.get('description') ),
        };
    },

    onClick: function (e) {
        var callback = this.model.get('callback');

        if (callback) {
            callback();
        }
    }
});
