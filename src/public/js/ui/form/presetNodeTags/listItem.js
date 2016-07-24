
import Marionette from 'backbone.marionette';
import listItemTemplate from './listItem.ejs';


export default Marionette.ItemView.extend({
    template: listItemTemplate,

    ui: {
        'key': '.key',
        'value': '.value',
        'keyReadOnly': '.key_read_only',
        'valueReadOnly': '.value_read_only',
        'nonOsmData': '.non_osm_data',
        'infoBtn': '.info_btn',
        'removeBtn': '.remove_btn',
    },

    events: {
        'blur @ui.key': 'updateKey',
        'blur @ui.value': 'updateValue',
        'keyup @ui.key': 'updateKey',
        'keyup @ui.value': 'updateValue',
        'change @ui.keyReadOnly': 'onChangeKeyReadOnly',
        'change @ui.valueReadOnly': 'onChangeValueReadOnly',
        'change @ui.nonOsmData': 'onChangeNonOsmData',
        'click @ui.removeBtn': 'onClickRemoveBtn',
    },

    templateHelpers: function () {
        return {
            'cid': this.model.cid
        };
    },

    onRender: function () {
        document.l10n.localizeNode( this.el );

        this.ui.nonOsmData.prop(
            'checked',
            this.model.get('nonOsmData')
        );

        this.ui.keyReadOnly.prop(
            'checked',
            this.model.get('keyReadOnly')
        );

        this.ui.valueReadOnly.prop(
            'checked',
            this.model.get('valueReadOnly')
        );

        this.onChangeValueReadOnly();
        this.onChangeKeyReadOnly();
        this.onChangeNonOsmData();

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

    onChangeKeyReadOnly: function (e) {
        this.model.set('keyReadOnly', this.ui.keyReadOnly.prop('checked'));

        this.ui.valueReadOnly.prop(
            'disabled',
            !this.model.get('keyReadOnly')
        );

        if ( !this.model.get('keyReadOnly') ) {
            this.ui.valueReadOnly.prop('checked', false);
        }
    },

    onChangeValueReadOnly: function (e) {
        this.model.set('valueReadOnly', this.ui.valueReadOnly.prop('checked'));
    },

    onChangeNonOsmData: function (e) {
        this.model.set('nonOsmData', this.ui.nonOsmData.prop('checked'));

        this.ui.keyReadOnly
        .prop('checked', true)
        .prop(
            'disabled',
            this.model.get('nonOsmData')
        );
        this.ui.valueReadOnly
        .prop('checked', false)
        .prop(
            'disabled',
            this.model.get('nonOsmData')
        );
    },

    onClickRemoveBtn: function (e) {
        this.model.destroy();
    },
});
