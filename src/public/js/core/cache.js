

export default class Cache {
    /**
     * @author Guillaume AMAT
     * @static
     * @access private
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {Object}
     */
    static _getKeyAndContributions (type, id) {
        return {
            'contributionKey': `${type}-${id}`,
            'contributions': JSON.parse( localStorage.getItem('contributions') ) || {}
        };
    }


    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} type - Element's type.
     * @param {string|number} id - Element's ID.
     * @returns {Object}
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

        if ( contributions[ contributionKey ] ) {
            delete contributions[ contributionKey ];
            localStorage.setItem('contributions', JSON.stringify( contributions ));
        }
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {Object} contribution.
     */
    static save (contribution) {
        let type = contribution.type,
        id = contribution.id,
        {contributionKey, contributions} = Cache._getKeyAndContributions(type, id);

        contributions[contributionKey] = contribution;

        localStorage.setItem( 'contributions', JSON.stringify( contributions ) );
    }
}
