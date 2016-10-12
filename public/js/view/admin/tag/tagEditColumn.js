
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/tag/tagEditColumn.ejs';
import TagType from 'ui/form/tagType';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.routeOnClose,
                triggerRouteOnClose: this.options.triggerRouteOnClose,
            },
        };
    },

    ui: {
        column: '.column',
        tagKey: '#tag_key',
    },

    events: {
        submit: 'onSubmit',
        reset: 'onReset',
    },

    regions: {
        type: '.rg_type',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
    },

    onRender() {
        this._tagType = new TagType({
            value: this.model.get('type'),
        });

        this.getRegion('type').show(this._tagType);
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onSubmit(e) {
        e.preventDefault();

        const tagKey = this.ui.tagKey.val().trim();
        const tagType = this._tagType.getValue();

        this.model.set('key', tagKey);
        this.model.set('type', tagType);

        if (this.options.isNew) {
            this.options.theme.get('tags').add( this.model );
        }

        this.model.updateModificationDate();
        this.options.theme.updateModificationDate();
        this.options.theme.save({}, {
            success: () => {
                this._oldModel = this.model.clone();

                this.close();
            },

            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },

    onReset() {
        this.close();
    },
});
