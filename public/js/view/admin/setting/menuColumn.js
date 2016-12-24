
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/setting/menuColumn.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    ui: {
        column: '.column',
        cacheArchiveItem: '.cache_archive',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        if ( this.options.config.overPassCacheArchiveEnabled === true ) {
            this.ui.cacheArchiveItem.removeClass('hide');
        }
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
});
