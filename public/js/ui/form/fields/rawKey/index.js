
import Marionette from 'backbone.marionette';
import template from './template.ejs';


export default Marionette.ItemView.extend({
    template,

    ui: {
        key: '.key',
        tagInfoBtn: '.tag_info_btn',
    },

    events: {
        'blur @ui.key': '_updateKey',
        'keyup @ui.key': '_updateKey',
    },

    templateHelpers() {
        return {
            placeholder: document.l10n.getSync('key'),
        };
    },

    onRender() {
        this.renderTagInfo();
    },

    renderTagInfo() {
        const key = this.model.get('key');
        const taginfoServiceHost = MAPCONTRIB.config.taginfoServiceHost;

        this.ui.tagInfoBtn.attr('href', `${taginfoServiceHost}/keys/${key}`);
    },

    _updateKey() {
        this.model.set(
            'key',
            this.ui.key.val().trim()
        );

        this.trigger('change', this.model.get('key'));

        this.renderTagInfo();
    },

    enable() {
        this.ui.key.prop('disabled', false);
    },

    disable() {
        this.ui.key.prop('disabled', true);
    },

    setFocus() {
        if (this.ui.key.focus) {
            this.ui.key.focus();
        }
    },
});
