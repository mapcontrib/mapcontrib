
import Marionette from 'backbone.marionette';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    ui: {
        'key': '.key',
        'value': '.value',
        'infoBtn': '.info_btn',
        'removeBtn': '.remove_btn',
    },

    events: {
        'blur @ui.key': 'updateKey',
        'blur @ui.value': 'updateValue',
        'keyup @ui.key': 'updateKey',
        'keyup @ui.value': 'updateValue',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    templateHelpers: function () {
        return {
            'cid': this.model.cid
        };
    },

    onRender: function () {
        document.l10n.localizeNode( this.el );

        if (this.model.get('keyReadOnly')) {
            this.ui.key.prop('disabled', 'disabled');
        }

        if (this.model.get('valueReadOnly')) {
            this.ui.value.prop('disabled', 'disabled');
        }

        if (this.model.get('keyReadOnly') || this.model.get('valueReadOnly')) {
            this.ui.removeBtn.prop('disabled', 'disabled');
        }

        this.renderTagInfo();
    },

    renderTagInfo: function () {
        const key = this.ui.key.val().trim();
        const taginfoServiceHost = MAPCONTRIB.config.taginfoServiceHost;

        this.ui.infoBtn.attr('href', `${taginfoServiceHost}/keys/${key}`);
    },

    updateKey: function (e) {
        const key = this.ui.key.val().trim();

        this.model.set( 'key', key );

        this.renderTagInfo();
    },

    updateValue: function (e) {
        this.model.set(
            'value',
            this.ui.value.val().trim()
        );
    },

    onClickRemoveBtn: function (e) {
        this.model.destroy();
    },
});
