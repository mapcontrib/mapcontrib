

export default class OverPassHelper {
    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} endPoint - The OverPass server end point.
     * @param {string} request - An OverPass request to prepare for web.
     * @param {number} size - The max result size in byte.
     */
    static buildUrlForCache (endPoint, request, size) {
        const finalRequest = escape(
            OverPassHelper.buildRequestForCache(request, size)
        );

        return `${endPoint}interpreter?data=${finalRequest}`;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} request - An OverPass request to prepare for web.
     * @param {number} size - The max result size in byte.
     */
    static buildRequestForCache (request, size) {
        let finalRequest = OverPassHelper.buildRequestForTheme(request).replace('({{bbox}})', '');

        return `[out:json][timeout:900][maxsize:${size}];${finalRequest}`;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} request - An OverPass request to prepare for web.
     */
    static buildRequestForTheme (request) {
        const requestSplit = request.split(';');
        let overPassRequest = '';

        for (let row of requestSplit) {
            row = row.trim();

            if ( !row ) {
                continue;
            }

            let split = row.split(' ');

            if (
                split[0] !== 'out' ||
                split.indexOf('skel') !== -1 ||
                split.indexOf('ids_only') !== -1
            ) {
                overPassRequest += `${row};`;
                continue;
            }

            if ( split.indexOf('body') !== -1 ) {
                delete split[ split.indexOf('body') ];
            }

            if ( split.indexOf('center') === -1 ) {
                split.push('center');
            }

            if ( split.indexOf('meta') === -1 ) {
                split.push('meta');
            }

            overPassRequest += split.join(' ') + ';';
        }

        return overPassRequest;
    }
}
