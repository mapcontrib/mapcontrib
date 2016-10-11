
import CONST from 'const';
import Sifter from 'sifter';


export default class IDPresetsHelper {
    constructor(presets) {
        this._presets = presets;

        this._prepareFieldTypes();
        this._prepareFieldsForTypeahead();
        this._prepareSifter();
    }

    /**
     * The localized strings are loaded from a JSON file and set here.
     *
     * @access public
     * @param {object} localeStrings
     */
    setLocaleStrings(localeStrings) {
        this._localeStrings = localeStrings;

        this._prepareFieldTypes();
        this._prepareFieldsForTypeahead();
        this._prepareSifter();
    }

    /**
     * Build an array of field types, to propose only the right fields with typehead.
     *
     * @access private
     */
    _prepareFieldTypes() {
        this._proposedFieldTypesForTypeahead = [];

        for (const index in CONST.tagType) {
            if ({}.hasOwnProperty.call(CONST.tagType, index)) {
                this._proposedFieldTypesForTypeahead.push(CONST.tagType[index]);
            }
        }
    }

    _prepareFieldsForTypeahead() {
        this._fieldsForTypeahead = this.getFields()
        .filter(field => this._proposedFieldTypesForTypeahead.indexOf(field.type) > -1);
    }

    getFieldsForTypeahead() {
        return this._fieldsForTypeahead;
    }

    _prepareSifter() {
        this._sifterPresets = [];

        for (const name in this._presets.presets) {
            if ({}.hasOwnProperty.call(this._presets.presets, name)) {
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

    getLocalizedFieldLabel(key) {
        for (const fieldName in this._presets.fields) {
            if ({}.hasOwnProperty.call(this._presets.fields, fieldName)) {
                const field = this._presets.fields[fieldName];

                if (field.key === key) {
                    return this._getLocalizedField(fieldName).label;
                }
            }
        }

        return false;
    }

    getLocalizedTypeaheadFieldLabel(key) {
        for (const field of this._fieldsForTypeahead) {
            if (field.key === key) {
                return field.label;
            }
        }

        return false;
    }

    _getLocalizedPreset(name) {
        if (this._presets.presets[name]) {
            const preset = { ...this._presets.presets[name] };

            preset.presetName = name;

            if (this._localeStrings && this._localeStrings.presets[name]) {
                const localizedStrings = { ...this._localeStrings.presets[name] };

                if (localizedStrings.name) {
                    preset.name = localizedStrings.name;
                }

                if (localizedStrings.terms) {
                    if (!preset.terms) {
                        preset.terms = [];
                    }

                    const terms = localizedStrings.terms
                    .split(',')
                    .map(term => term.trim());

                    preset.terms = [
                        ...preset.terms,
                        ...terms,
                    ];
                }
            }

            return preset;
        }

        return false;
    }

    _getLocalizedField(name) {
        if (this._presets.fields[name]) {
            const field = { ...this._presets.fields[name] };

            if (this._localeStrings && this._localeStrings.fields[name]) {
                const localizedStrings = { ...this._localeStrings.fields[name] };

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

    getPreset(name) {
        return this._presets.presets[name];
    }

    getField(name) {
        const properName = name.replace(':', '/');
        return this._presets.fields[properName];
    }

    getFields() {
        const fields = [];

        for (const name in this._presets.fields) {
            if ({}.hasOwnProperty.call(this._presets.fields, name)) {
                const field = this._getLocalizedField(name);

                if (field) {
                    fields.push(field);
                }
            }
        }

        return fields;
    }

    buildPresetsFromSearchString(searchString) {
        const results = this._sifter.search(searchString, {
            fields: [ 'rawName', 'name', 'terms' ],
            sort: [{ field: 'name', direction: 'asc' }],
            limit: 20,
        });

        return results.items.map(result => this._sifterPresets[result.id].preset);
    }
}
