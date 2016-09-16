
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import NavPillsStackedListView from 'ui/navPillsStacked';
import template from 'templates/editPoiPresetColumn.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
        column: {
            appendToBody: true,
        },
    },

    regions: {
        presetsNav: '.rg_presets_nav',
        noThanksNav: '.rg_no_thanks_nav',
    },

    ui: {
        column: '#edit_poi_preset_column',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
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

    setCenter( center ) {
        this._center = center;
    },

    onRender() {
        const presetNavItems = [];
        const presetsNav = new NavPillsStackedListView();
        const noThanksNav = new NavPillsStackedListView();
        const presetModels = this.options.theme.get('presets').models;
        const options = {
            app: this.options.app,
            osmType: this.options.osmType,
            osmId: this.options.osmId,
            layerModel: this.options.layerModel,
            layer: this.options.layer,
        };


        for (const key in presetModels) {
            if ({}.hasOwnProperty.call(presetModels, key)) {
                presetNavItems.push({
                    label: presetModels[key].get('name'),
                    description: presetModels[key].get('description'),
                    callback: this._radio.commands.execute.bind(
                        this._radio.commands,
                        'column:showEditPoi',
                        {
                            ...options,
                            presetModel: presetModels[key],
                        }
                    ),
                });
            }
        }

        presetsNav.setItems(presetNavItems);

        noThanksNav.setItems([{
            label: document.l10n.getSync('editPoiPresetColumn_noThanks'),
            callback: this._radio.commands.execute.bind(
                this._radio.commands,
                'column:showEditPoi',
                options
            ),
        }]);

        this.getRegion('presetsNav').show( presetsNav );
        this.getRegion('noThanksNav').show( noThanksNav );
    },
});
