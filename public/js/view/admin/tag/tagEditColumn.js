
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/admin/tag/tagEditColumn.ejs';
import CONST from 'const';
import TagType from 'ui/form/tagType';
import SearchList from 'ui/form/searchList';


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
    },

    events: {
        submit: 'onSubmit',
        reset: 'onReset',
    },

    regions: {
        type: '.rg_type',
        locales: '.rg_locales',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
    },

    onRender() {
        this.getRegion('type').show(
            new TagType({
                id: 'tag_type',
                value: this.model.get('type'),
            })
        );

        const searchLocales = new SearchList({
            items: [
                {
                    label: 'Français',
                    progression: 100,
                    href: '#',
                    callback: undefined,
                },
                {
                    label: 'Anglais',
                    progression: 65,
                    href: '#',
                    callback: undefined,
                },
                {
                    label: 'Italien',
                    progression: 0,
                    href: '#',
                    callback: undefined,
                },
            ],
        });
        this.getRegion('locales').show(searchLocales);
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

        const map = this._radio.reqres.request('map');
        const mapCenter = map.getCenter();
        const mapZoomLevel = map.getZoom();
        const themeName = this.ui.themeName.val();
        const themeDescription = this.ui.themeDescription.val();
        const themeAnalyticScript = this.ui.themeAnalyticScript.val();

        this.model.set('name', themeName);
        this.model.set('description', themeDescription);
        this.model.set('analyticScript', themeAnalyticScript);
        this.model.updateModificationDate();

        window.history.pushState({}, themeName, this.model.buildPath());

        this.model.set('autoCenter', false);

        if ( this.ui.themePositionSetNew.prop('checked') === true ) {
            this.model.set('center', mapCenter);
            this.model.set('zoomLevel', mapZoomLevel);
        }

        if ( this.ui.themePositionAutoCenter.prop('checked') === true ) {
            this.model.set('autoCenter', true);
        }

        if ( this.ui.themeInfoDisplayPopup.prop('checked') === true ) {
            this.model.set('infoDisplay', CONST.infoDisplay.popup);
        }
        else if ( this.ui.themeInfoDisplayModal.prop('checked') === true ) {
            this.model.set('infoDisplay', CONST.infoDisplay.modal);
        }
        else if ( this.ui.themeInfoDisplayColumn.prop('checked') === true ) {
            this.model.set('infoDisplay', CONST.infoDisplay.column);
        }

        this.model.save({}, {
            success: () => {
                if (this.model.get('infoDisplay') !== this._oldModel.get('infoDisplay')) {
                    if (this.model.get('infoDisplay') === CONST.infoDisplay.popup) {
                        this._radio.commands.execute('map:bindAllPopups');
                    }
                    else {
                        this._radio.commands.execute('map:unbindAllPopups');
                    }
                }

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
