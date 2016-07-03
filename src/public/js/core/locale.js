
import currentLocale from 'current-locale';


export default class Locale {
    static getLocale () {
        let locale = currentLocale().substr(0, 2);

        if (['fr', 'en'].indexOf(locale) === -1) {
            locale = 'en';
        }

        return locale;
    }
}
