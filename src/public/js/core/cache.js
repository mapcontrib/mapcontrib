

export default class Cache {
    /**
     * @author Guillaume AMAT
     * @static
     * @access private
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {object}
     */
    static _getKeyAndContributions (type, id) {
        return {
            'contributionKey': `${type}/${id}`,
            'contributions': JSON.parse( localStorage.getItem('contributions') ) || {}
        };
    }


    /**
     * @author Guillaume AMAT
     * @static
     * @access private
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {object}
     */
    static _getKeyAndOsmEditElements (type, id) {
        return {
            'osmEditKey': `${type}/${id}`,
            'osmEditElements': JSON.parse( localStorage.getItem('osmEditElements') ) || {}
        };
    }


    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {object}
     */
    static get (type, id) {
        let {contributionKey, contributions} = Cache._getKeyAndContributions(type, id);

        if ( contributions[ contributionKey ] ) {
            return contributions[ contributionKey ];
        }

        return false;
    }


    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {object}
     */
    static getOsmEditElement (type, id) {
        let {osmEditKey, osmEditElements} = Cache._getKeyAndOsmEditElements(type, id);

        if ( osmEditElements[ osmEditKey ] ) {
            return osmEditElements[ osmEditKey ];
        }

        return false;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {boolean}
     */
    static exists (type, id) {
        let {contributionKey, contributions} = Cache._getKeyAndContributions(type, id);

        if ( contributions[ contributionKey ] ) {
            return true;
        }

        return false;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {boolean}
     */
    static osmEditExists (type, id) {
        let {osmEditKey, osmEditElements} = Cache._getKeyAndOsmEditElements(type, id);

        if ( osmEditElements[ osmEditKey ] ) {
            return true;
        }

        return false;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @param {string|number} version - Element's version.
     * @returns {boolean}
     */
    static isNewerThanCache (type, id, version) {
        let {contributionKey, contributions} = Cache._getKeyAndContributions(type, id);

        if ( contributions[ contributionKey ] ) {
            if ( version > contributions[ contributionKey ].version ) {
                return true;
            }
        }

        return false;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     */
    static remove (type, id) {
        let {contributionKey, contributions} = Cache._getKeyAndContributions(type, id);
        let {osmEditKey, osmEditElements} = Cache._getKeyAndOsmEditElements(type, id);

        if ( contributions[ contributionKey ] ) {
            delete contributions[ contributionKey ];
            localStorage.setItem('contributions', JSON.stringify( contributions ));
        }

        if ( osmEditElements[ osmEditKey ] ) {
            delete osmEditElements[ osmEditKey ];
            localStorage.setItem('osmEditElements', JSON.stringify( osmEditElements ));
        }
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} contribution.
     */
    static save (contribution) {
        let type = contribution.type,
        id = contribution.id,
        {contributionKey, contributions} = Cache._getKeyAndContributions(type, id);

        contributions[contributionKey] = contribution;

        localStorage.setItem( 'contributions', JSON.stringify( contributions ) );
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {object} osmEdit element.
     */
    static saveOsmEditElement (osmEditElement) {
        let type = osmEditElement.type,
        id = osmEditElement.attributes.id,
        {osmEditKey, osmEditElements} = Cache._getKeyAndOsmEditElements(type, id);

        osmEditElements[osmEditKey] = osmEditElement;

        localStorage.setItem( 'osmEditElements', JSON.stringify( osmEditElements ) );
    }
}
