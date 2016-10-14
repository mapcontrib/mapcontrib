
import CONST from 'const';
import currentLocale from 'current-locale';
// import localizedCountries from 'localized-countries';


export default class Locale {
    static getLocale() {
        let locale = currentLocale().substr(0, 2);

        if (CONST.availableLocales.indexOf(locale) === -1) {
            locale = 'en';
        }

        return locale;
    }

    static buildLocalesCompletion(themeModel) {
        const localesCompletion = [];
        const countries = require("localized-countries")(require("localized-countries/data/en"));
        // const countries = localizedCountries( Locale.getLocale() );

        for (const code of CONST.availableLocales) {
            let completion = 0;
            const presets = themeModel.get('presets');
            const presetCategories = themeModel.get('presetCategories');
            const tags = themeModel.get('tags');

            localesCompletion.push({
                code,
                label: countries.get(code.toUpperCase()),
                completion,
            });
        }

        return localesCompletion;
    }
}
