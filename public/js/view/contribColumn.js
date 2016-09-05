
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import NavPillsStackedListView from '../ui/navPillsStacked';
import SearchInput from '../ui/form/searchInput';
import template from '../../templates/contribColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    regions: {
        'searchInput': '.rg_search_input',
        'presetsNav': '.rg_presets_nav',
        'freeAdditionNav': '.rg_free_addition_nav',
    },

    ui: {
        'column': '#contrib_column',
        'noResult': '.no_result',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.render();
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
        this._searchInput = new SearchInput({
            charactersMin: 1,
            placeholder: document.l10n.getSync('contribColumn_searchAPreset'),
        });

        this.getRegion('searchInput').show( this._searchInput );

        this._searchInput.on('search', this._filterPresets, this);
        this._searchInput.setFocus();

        const presetNavItems = [];
        const presetModels = this.options.theme.get('presets').models;
        const freeAdditionNav = new NavPillsStackedListView();
        this._presetsNav = new NavPillsStackedListView();

        for (const key in presetModels) {
            if (presetModels.hasOwnProperty(key)) {
                presetNavItems.push({
                    'label': presetModels[key].get('name'),
                    'description': presetModels[key].get('description'),
                    'callback': this._radio.commands.execute.bind(
                        this._radio.commands,
                        'column:showContribForm',
                        {
                            'presetModel': presetModels[key],
                            'center': this._center,
                            'iDPresetsHelper': this.options.iDPresetsHelper,
                        }
                    )
                });
            }
        }

        const defaultIDPresets = this.options.iDPresetsHelper.getDefaultPoints();

        for (const iDPreset of defaultIDPresets) {
            presetNavItems.push({
                'label': iDPreset.name,
                // 'callback': this._radio.commands.execute.bind(
                //     this._radio.commands,
                //     'column:showContribForm',
                //     {
                //         'presetModel': presetModels[key],
                //         'center': this._center,
                //         'iDPresetsHelper': this.options.iDPresetsHelper,
                //     }
                // )
            });
        }

        this._presetsNav.setItems(presetNavItems);
        this._searchInput.on(
            'empty',
            this._presetsNav.setItems.bind(this._presetsNav, presetNavItems),
            this
        );

        freeAdditionNav.setItems([{
            'label': document.l10n.getSync('contribColumn_freeAddition'),
            'callback': this._radio.commands.execute.bind(
                this._radio.commands,
                'column:showContribForm',
                {
                    'center': this._center,
                }
            )
        }]);

        this.getRegion('presetsNav').show( this._presetsNav );
        this.getRegion('freeAdditionNav').show( freeAdditionNav );
    },

    _filterPresets(searchString) {
        this._searchInput.trigger('search:success');

        const navItems = [];
        const presets = this.options.iDPresetsHelper.buildPresetsFromSearchString(searchString);

        for (const preset of presets) {
            navItems.push({
                'label': preset.name,
                // 'description': presetModels[key].get('description'),
                // 'callback': this._radio.commands.execute.bind(
                //     this._radio.commands,
                //     'column:showContribForm',
                //     {
                //         'presetModel': presetModels[key],
                //         'center': this._center,
                //         'iDPresetsHelper': this.options.iDPresetsHelper,
                //     }
                // )
            });
        }

        this._presetsNav.setItems(navItems);

        if (presets.length === 0) {
            this._showNoResult();
        }
        else {
            this._hideNoResult();
        }
    },

    _hideNoResult() {
        this.ui.noResult.addClass('hide');
    },

    _showNoResult() {
        this.ui.noResult.removeClass('hide');
    },
});
