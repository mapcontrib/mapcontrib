
import Marionette from 'backbone.marionette';
import listItemTemplate from './listItem.ejs';


export default Marionette.LayoutView.extend({
    template: listItemTemplate,

    behaviors() {
        return {
            l20n: {},
        };
    },

    ui: {
        inputValue: '.value',
        removeBtn: '.remove_btn',
    },

    events: {
        'click @ui.removeBtn': '_onClickRemove',
        'change @ui.inputValue': '_onChangeInputValue',
    },

    _onClickRemove() {
        this.model.destroy();
    },

    _onChangeInputValue() {
        this.model.set('value', this.ui.inputValue.val().trim());
    },
});
