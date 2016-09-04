
export default class IDPresetsHelper {
    constructor(presets, locales) {
        this._presets = presets;
    }

    setLocale(locale) {
        this._locale = locale;
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

    _getLocalizedPreset(name) {
        if (this._presets.presets[name]) {
            const preset = this._presets.presets[name];

            if (this._locale) {
                const localizedStrings = this._locale.presets[name];

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
}
