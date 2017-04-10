
import CONST from '../const';
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
                Locale._buildLocaleCompletionFromCollection(layers, localeCode),
                Locale._buildLocaleCompletionFromCollection(presets, localeCode),
                Locale._buildLocaleCompletionFromCollection(presetCategories, localeCode),
                Locale._buildLocaleCompletionFromCollection(tags, localeCode),
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

    static buildItemsLocaleCompletion(themeModel, localeCode) {
        const layers = themeModel.get('layers');
        const presets = themeModel.get('presets');
        const presetCategories = themeModel.get('presetCategories');
        const tags = themeModel.get('tags');

        const presetData = Locale._buildLocaleCompletionFromCollection(presets, localeCode);
        const categoriesData = Locale._buildLocaleCompletionFromCollection(
            presetCategories,
            localeCode
        );

        const localesCompletion = [
            {
                id: 'theme',
                label: document.l10n.getSync('mainSettings'),
                data: themeModel.getLocaleCompletion(localeCode),
            },
            {
                id: 'layer',
                label: document.l10n.getSync('layers'),
                data: Locale._buildLocaleCompletionFromCollection(layers, localeCode),
            },
            {
                id: 'tag',
                label: document.l10n.getSync('tags'),
                data: Locale._buildLocaleCompletionFromCollection(tags, localeCode),
            },
            {
                id: 'preset',
                label: document.l10n.getSync('presets'),
                data: {
                    items: presetData.items + categoriesData.items,
                    completed: presetData.completed + categoriesData.completed,
                },
            },
        ];

        for (const locale of localesCompletion) {
            locale.completion = format(
                (locale.data.completed / locale.data.items) * 100,
                {
                    floor: 1,
                    ifInfinity: 0,
                }
            );
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

    static getLocalized(model, attributeName) {
        const locale = Locale.getLocale();
        const modelLocales = model.get('locales');

        if (!modelLocales || !modelLocales[locale]) {
            return model.get(attributeName);
        }

        const attributes = modelLocales[locale];

        if (attributes && attributes[attributeName]) {
            return attributes[attributeName];
        }

        return model.get(attributeName);
    }

    static getLocalizedOptions(model) {
        const locale = Locale.getLocale();
        const options = model.get('options');
        const attributes = model.get('locales')[locale];
        let localizedOptions = {};

        if (attributes && attributes.options) {
            localizedOptions = attributes.options;
        }

        for (const option of options) {
            if (!localizedOptions[option]) {
                localizedOptions[option] = option;
            }
        }

        return localizedOptions;
    }
}
