
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import NavPillsStackedListView from 'ui/navPillsStacked';
import SearchInput from 'ui/form/searchInput';
import template from 'templates/contribColumn.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
        column: {},
    },

    regions: {
        searchInput: '.rg_search_input',
        presetsNav: '.rg_presets_nav',
    },

    ui: {
        column: '#contrib_column',
        presetsNav: '.rg_presets_nav',
        stickyInner: '.sticky-inner',
        noResult: '.no_result',
        footer: '.sticky-footer',
        freeAdditionBtn: '.free_addition_btn',
    },

    events: {
        'click @ui.freeAdditionBtn': 'onClickFreeAddition',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._presets = this.options.theme.get('presets');
        this._presetCategories = this.options.theme.get('presetCategories');
        this._iDPresetsHelper = this.options.iDPresetsHelper;
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

    _buildNavItemsFromPresetModels(presetModels) {
        return presetModels.map(presetModel => ({
            label: presetModel.get('name'),
            description: presetModel.get('description'),
            callback: this._radio.commands.execute.bind(
                this._radio.commands,
                'column:showContribForm',
                {
                    presetModel,
                    center: this._center,
                }
            ),
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

    _buildNavItemsFromIDPresets(defaultIDPresets) {
        return defaultIDPresets.map(iDPreset => ({
                label: iDPreset.name,
                // callback: this._radio.commands.execute.bind(
                //     this._radio.commands,
                //     'column:showContribForm',
                //     {
                //         presetModel: presetModels[key],
                //         center: this._center,
                //     }
                // )
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
        this.getRegion('presetsNav').show( this._presetsNav );


        this._searchInput = new SearchInput({
            charactersMin: 1,
            placeholder: document.l10n.getSync('contribColumn_searchAPreset'),
        });

        this.getRegion('searchInput').show( this._searchInput );
        this._searchInput.setFocus();
        this._searchInput.on('search', this._filterPresets, this);
        this._searchInput.on(
            'empty',
            this._presetsNav.setItems.bind(this._presetsNav, defaultPresetNavItems),
            this
        );

        if ( !this.options.config.freeTagsContributionEnabled ) {
            this._hideFooter();
        }
    },

    _filterPresets(searchString) {
        this._searchInput.trigger('search:success');
        this._scrollToResultsTop();

        const iDPresets = this._iDPresetsHelper.buildPresetsFromSearchString(searchString);
        const presetModels = this._presets.buildPresetsFromSearchString(searchString);
        const presetNavItems = [
            ...this._buildNavItemsFromPresetModels(presetModels),
            ...this._buildNavItemsFromIDPresets(iDPresets),
        ];

        this._presetsNav.setItems(presetNavItems);

        if (presetNavItems.length === 0) {
            this._showNoResult();
        }
        else {
            this._hideNoResult();
        }
    },

    _scrollToResultsTop() {
        window.requestAnimationFrame(() => {
            this.ui.stickyInner[0].scroll({ top: 0, behavior: 'smooth' });
        });
    },

    _hideNoResult() {
        this.ui.noResult.addClass('hide');
    },

    _showNoResult() {
        this.ui.noResult.removeClass('hide');
    },

    _hideFooter() {
        this.ui.footer.addClass('hide');
        this.ui.stickyInner.removeClass('sticky-inner');
    },

    onClickFreeAddition() {
        this._radio.commands.execute(
            'column:showContribForm',
            {
                center: this._center,
            }
        );
    },
});
