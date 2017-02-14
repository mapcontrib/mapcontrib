
import Diacritics from 'diacritic';

export default class Theme {
    /**
     * Returns a URL-friendly name of the theme.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} nameArg
     * @return string
     */
    static buildWebLinkName(nameArg) {
        let name = nameArg || '';

        name = Diacritics.clean(name);
        name = name.replace(/-/g, '_');
        name = name.replace(/ /g, '_');
        name = name.replace(/_{2,}/g, '_');
        name = name.replace(/[^a-zA-Z0-9_]/g, '');

        return name;
    }

    /**
     * Returns the theme path.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @pram {string} fragment
     * @pram {string} name
     * @return string
     */
    static buildPath(fragment, name) {
        const basePath = `/t/${fragment}`;
        const webName = this.buildWebLinkName(name);

        if (webName) {
            return `${basePath}-${webName}`;
        }

        return basePath;
    }

    /**
     * Returns the theme url.
     *
     * @author Guillaume AMAT
     * @static
     * @access public
     * @pram {object} The browser's window object
     * @pram {string} fragment
     * @pram {string} name
     * @return string
     */
    static buildUrl(window, fragment, name) {
        const urlParts = [
            window.location.protocol,
            '//',
            window.location.host,
            this.buildPath(fragment, name),
        ];

        return urlParts.join('');
    }
}
