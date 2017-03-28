
import Marionette from 'backbone.marionette';
import CONST from 'const';
import template from './template.ejs';
import WidgetUi from 'ui/widget';


export default Marionette.ItemView.extend({
    template,

    ui: {
        key: '.key',
        tagInfoBtn: '.tag_info_btn',
    },

    events: {
        'change @ui.key': '_updateKey',
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
        const key = this.ui.key.val().trim();
        const field = this.options.iDPresetsHelper.getField(key);

        this.model.set('key', key);

        if (field) {
            this.model.set('type', field.type);
        }
        else {
            this.model.set('type', CONST.tagType.text);
        }

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
        WidgetUi.setFocus(this.ui.key);
    },
});
