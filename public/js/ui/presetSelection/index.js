
import Marionette from 'backbone.marionette';
import NavPillsStackedListView from 'ui/navPillsStacked';
import SearchInput from 'ui/form/searchInput';


export default Marionette.LayoutView.extend({
    template: false,

    behaviors() {
        return {
            l20n: {},
        };
    },

    initialize() {
        this._presets = this.options.theme.get('presets');
        this._presetCategories = this.options.theme.get('presetCategories');
        this._iDPresetsHelper = this.options.iDPresetsHelper;

        this.render();
    },

    _buildNavItemsFromPresetModels(presetModels) {
        return presetModels.map(presetModel => ({
            label: presetModel.get('name'),
            description: presetModel.get('description'),
            callback: () => {
                this.options.callbacks.customPreset(presetModel);
            },
        }));
    },

    _buildNavItemsFromPresetCategoryModels(presetCategoryModels, parentModel) {
        const items = presetCategoryModels
        .filter((model) => {
            const child = this._presets.findWhere({ parentUuid: model.get('uuid') });

            if (!child) {
                return false;
            }

            return true;
        })
        .map(model => ({
            rightIcon: '<i class="fa fa-chevron-right"></i>',
            label: model.get('name'),
            callback: this._displayPresetCategoryChildren.bind(this, model),
        }));

        const backItem = {
            leftIcon: '<i class="fa fa-chevron-left"></i>',
            label: document.l10n.getSync('back'),
        };

        if (parentModel) {
            backItem.callback = this._displayPresetCategoryChildren.bind(
                this,
                this._presetCategories.findWhere({ uuid: parentModel.get('parentUuid') })
            );
            items.unshift(backItem);
        }

        return items;
    },

    _buildNavItemsFromIDPresets(IDPresets) {
        return IDPresets.map(iDPreset => ({
                label: iDPreset.name,
                callback: () => {
                    this.options.callbacks.iD(iDPreset);
                },
        }));
    },

    _buildDefaultNavItems() {
        if (this._presets.length > 0) {
            return [
                ...this._buildNavItemsFromPresetCategoryModels(
                    this._presetCategories.where({ parentUuid: undefined })
                ),
                ...this._buildNavItemsFromPresetModels(
                    this._presets.where({ parentUuid: undefined })
                ),
            ];
        }

        const defaultIDPresets = this._iDPresetsHelper.getDefaultPoints();
        return this._buildNavItemsFromIDPresets(defaultIDPresets);
    },

    _displayPresetCategoryChildren(presetCategoryModel) {
        let parentUuid;

        if (presetCategoryModel) {
            parentUuid = presetCategoryModel.get('uuid');
        }

        this._presetsNav.setItems([
            ...this._buildNavItemsFromPresetCategoryModels(
                this._presetCategories.where({ parentUuid }),
                presetCategoryModel
            ),
            ...this._buildNavItemsFromPresetModels(
                this._presets.where({ parentUuid })
            ),
        ]);
    },

    onRender() {
        const defaultPresetNavItems = this._buildDefaultNavItems();

        this._presetsNav = new NavPillsStackedListView();
        this._presetsNav.setItems(defaultPresetNavItems);
        this.options.regions.presetsNav.show( this._presetsNav );


        this._searchInput = new SearchInput({
            charactersMin: 1,
            placeholder: document.l10n.getSync('contribColumn_searchAPreset'),
        });

        this.options.regions.searchInput.show( this._searchInput );
        this._searchInput.setFocus();
        this._searchInput.on('search', this.trigger.bind(this, 'search'), this);
        this._searchInput.on('search', this._filterPresets, this);
        this._searchInput.on('empty', this.trigger.bind(this, 'empty'), this);
        this._searchInput.on(
            'empty',
            this._presetsNav.setItems.bind(this._presetsNav, defaultPresetNavItems),
            this
        );
    },

    _filterPresets(searchString) {
        this._searchInput.trigger('search:success');

        const iDPresets = this._iDPresetsHelper.buildPresetsFromSearchString(searchString);
        const presetModels = this._presets.buildPresetsFromSearchString(searchString);
        const presetNavItems = [
            ...this._buildNavItemsFromPresetModels(presetModels),
            ...this._buildNavItemsFromIDPresets(iDPresets),
        ];

        this._presetsNav.setItems(presetNavItems);

        if (presetNavItems.length === 0) {
            this.trigger('search:noResult');
        }
        else {
            this.trigger('search:success');
        }
    },
});
