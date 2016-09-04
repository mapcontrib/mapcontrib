
import Sifter from 'sifter';


export default class IDPresetsHelper {
    constructor(presets, locales) {
        this._presets = presets;

        this._prepareSifter();
    }

    setLocale(locale) {
        this._locale = locale;

        this._prepareSifter();
    }

    _prepareSifter() {
        this._sifterPresets = [];

        for (const name in this._presets.presets) {
            if (this._presets.presets.hasOwnProperty(name)) {
                const preset = this._presets.presets[name];

                if (preset.geometry.indexOf('point') === -1) {
                    continue;
                }

                if (preset.searchable === false) {
                    continue;
                }

                const localizedPreset = this._getLocalizedPreset(name);

                if (!localizedPreset.terms) {
                    localizedPreset.terms = [];
                }

                this._sifterPresets.push({
                    rawName: preset.name,
                    name: localizedPreset.name,
                    terms: localizedPreset.terms.join(' '),
                    preset: localizedPreset,
                });
            }
        }

        this._sifter = new Sifter(this._sifterPresets);
    }

    _getLocalizedPreset(name) {
        if (this._presets.presets[name]) {
            const preset = {...this._presets.presets[name]};

            if (this._locale && this._locale.presets[name]) {
                const localizedStrings = {...this._locale.presets[name]};

                if (localizedStrings.name) {
                    preset.name = localizedStrings.name;
                }

                if (localizedStrings.terms) {
                    if (!preset.terms) {
                        preset.terms = [];
                    }

                    const terms = localizedStrings.terms
                    .split(',')
                    .map(term => {
                        return term.trim();
                    });

                    preset.terms = [
                        ...preset.terms,
                        ...terms
                    ];
                }
            }

            return preset;
        }

        return false;
    }

    getDefaultPoints() {
        const defaultPresets = [];

        for (const name of this._presets.defaults.point) {
            const preset = this._getLocalizedPreset(name);

            if (preset) {
                defaultPresets.push(preset);
            }
        }

        return defaultPresets;
    }

    buildNavItemsFromSearchString(searchString) {
        const navItems = [];
        const results = this._sifter.search(searchString, {
            fields: [ 'rawName', 'name', 'terms' ],
            sort: [{ field: 'name', direction: 'asc' }],
            limit: 10
        });

        for (const result of results.items) {
            const preset = this._sifterPresets[result.id].preset;

            navItems.push({
                'label': preset.name,
                // 'description': presetModels[key].get('description'),
                // 'callback': this._radio.commands.execute.bind(
                //     this._radio.commands,
                //     'column:showContribForm',
                //     {
                //         'presetModel': presetModels[key],
                //         'center': this._center,
                //     }
                // )
            });
        }

        return navItems;
    }
}
