
import Sifter from 'sifter';


export default class IDPresetsHelper {
    constructor(presets, locales) {
        this._presets = presets;
        this._proposedFieldsForTypeahead = [
            'text', 'number'
        ];

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

    _getLocalizedField(name) {
        if (this._presets.fields[name]) {
            const field = {...this._presets.fields[name]};

            if (this._locale && this._locale.fields[name]) {
                const localizedStrings = {...this._locale.fields[name]};

                if (localizedStrings.label) {
                    field.label = localizedStrings.label;
                }

                // if (localizedStrings.options) {
                //     if (!field.options) {
                //         field.options = [];
                //     }
                //
                //     const options = localizedStrings.options
                //     .split(',')
                //     .map(term => {
                //         return term.trim();
                //     });
                //
                //     field.options = [
                //         ...field.options,
                //         ...options
                //     ];
                // }
            }

            return field;
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

    getFields() {
        const fields = [];

        for (const name in this._presets.fields) {
            const field = this._getLocalizedField(name);

            if (field) {
                fields.push(field);
            }
        }

        return fields;
    }

    buildFieldsForTypeahead() {
        return this.getFields()
        .filter(field => this._proposedFieldsForTypeahead.indexOf(field.type) > -1);
    }

    buildPresetsFromSearchString(searchString) {
        const navItems = [];
        const results = this._sifter.search(searchString, {
            fields: [ 'rawName', 'name', 'terms' ],
            sort: [{ field: 'name', direction: 'asc' }],
            limit: 20
        });

        return results.items.map(result => {
            return this._sifterPresets[result.id].preset;
        });
    }
}
