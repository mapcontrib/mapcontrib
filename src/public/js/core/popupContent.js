

export default class PopupContent {

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} content - a popup content.
     * @returns {Array}
     */
    static findTagsFromContent (content) {
        let re = new RegExp('{(.*?)}', 'g');
        let matches = content.match(re);
        let tags = [];

        for (let rawTag of matches) {
            tags.push(
                rawTag.replace( /\{(.*?)\}/g, '$1' )
            );
        }

        return tags;
    }
}
