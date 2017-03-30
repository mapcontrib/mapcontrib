
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/user/userColumn.ejs';


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
        blogLinks: '.blog_link',
        goBackToHomeNav: '.go_back_to_home_nav',
        duplicateItem: '.duplicate_item',
        logoutItem: '.logout_item',
    },

    events: {
        'click @ui.logoutItem': 'close',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._app = this.options.app;
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onRender() {
        if (document.l10n.supportedLocales.length > 0 && document.l10n.supportedLocales[0] === 'fr') {
            this.ui.blogLinks.each((index, element) => {
                element.href = element.href.replace('blog.mapcontrib.xyz', 'blog.mapcontrib.xyz/fr');
            });
        }

        if ( this._app.isThemePage() ) {
            this.ui.goBackToHomeNav.removeClass('hide');
            this.ui.duplicateItem.removeClass('hide');
        }
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
