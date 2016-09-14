
import Marionette from 'backbone.marionette';
import template from './template.ejs';


export default Marionette.ItemView.extend({
    template,

    ui: {
        'key': '.key',
        'tagInfoBtn': '.tag_info_btn',
    },

    events: {
        'blur @ui.input': 'updateKey',
        'keyup @ui.input': 'updateKey',
    },

    onRender() {
        document.l10n.localizeNode( this.el );

        this.renderTagInfo();
    },

    renderTagInfo() {
        const key = this.model.get('key');
        const taginfoServiceHost = MAPCONTRIB.config.taginfoServiceHost;

        this.ui.tagInfoBtn.attr('href', `${taginfoServiceHost}/keys/${key}`);
    },

    updateKey(e) {
        this.model.set(
            'key',
            this.ui.key.val().trim()
        );
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
