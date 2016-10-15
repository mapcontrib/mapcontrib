
import CONST from 'const';
import currentLocale from 'current-locale';
import langs from 'langs';
import format from 'math.format';


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

        for (const localeCode of CONST.availableLocales) {
            const isoInfos = langs.where('1', localeCode);

            const layers = themeModel.get('layers');
            const presets = themeModel.get('presets');
            const presetCategories = themeModel.get('presetCategories');
            const tags = themeModel.get('tags');

            const localeCompletions = [
                themeModel.getLocaleCompletion(localeCode),
                Locale._buildLocaleCompletionFromCollection(layers, isoInfos.code),
                Locale._buildLocaleCompletionFromCollection(presets, isoInfos.code),
                Locale._buildLocaleCompletionFromCollection(presetCategories, isoInfos.code),
                Locale._buildLocaleCompletionFromCollection(tags, isoInfos.code),
            ];

            /* eslint-disable no-unused-vars */
            let itemsCount = 0;
            let completedItemsCount = 0;
            /* eslint-enable */
            for (const localeCompletion of localeCompletions) {
                itemsCount += localeCompletion.items;
                completedItemsCount += localeCompletion.completed;
            }

            const totalCompletion = format(
                (completedItemsCount / itemsCount) * 100,
                {
                    floor: 1,
                    ifInfinity: 0,
                }
            );

            localesCompletion.push({
                code: localeCode,
                label: isoInfos.name,
                description: isoInfos.local,
                completion: totalCompletion,
            });
        }

        return localesCompletion;
    }

    static _buildLocaleCompletionFromCollection(collection, localeCode) {
        const data = {
            items: 0,
            completed: 0,
        };

        for (const model of collection.models) {
            const { items, completed } = model.getLocaleCompletion(localeCode);

            data.items += items;
            data.completed += completed;
        }

        return data;
    }
}
