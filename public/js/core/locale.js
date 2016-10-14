
import CONST from 'const';
import currentLocale from 'current-locale';
import langs from 'langs';


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

        for (const localCode of CONST.availableLocales) {
            let completion = 0;
            const isoInfo = langs.where('1', localCode);
            const presets = themeModel.get('presets');
            const presetCategories = themeModel.get('presetCategories');
            const tags = themeModel.get('tags');

            localesCompletion.push({
                code: localCode,
                label: isoInfo.name,
                description: isoInfo.local,
                completion,
            });
        }

        return localesCompletion;
    }
}
