
import GeoUtils from '../core/geoUtils.js';


export default class OverPassHelper {
    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} endPoint - The OverPass server end point.
     * @param {string} request - An OverPass request to prepare for web.
     * @param {number} size - The max result size in byte.
     * @return {string}
     */
    static buildUrlForCache(endPoint, request, size, lat, lon, zoom) {
        const finalRequest = escape(
            OverPassHelper.buildRequestForCache(request, size, lat, lon, zoom)
        );

        return `${endPoint}interpreter?data=${finalRequest}`;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} request - An OverPass request to prepare for web.
     * @param {number} size - The max result size in byte.
     * @param {float} lat - Optional: The latitude of the bbox center.
     * @param {float} lon - Optional: The longitude of the bbox center.
     * @param {number} zoom - Optional: The zoom of the bbox.
     * @return {string}
     */
    static buildRequestForCache(request, size, lat, lon, zoom) {
        let finalRequest = OverPassHelper.buildRequestForTheme(request);

        if (
            typeof lat !== 'undefined' &&
            typeof lon !== 'undefined' &&
            typeof zoom !== 'undefined'
        ) {
            const bounds = GeoUtils.zoomLatLngWidthHeightToBbox(zoom, lat, lon, 3840, 2160);
            const bbox = `${bounds._southWest.lat},${bounds._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng}`;

            finalRequest = finalRequest.replace(/\(\{\{bbox\}\}\)/g, `(${bbox})`);
        }
        else {
            finalRequest = finalRequest.replace(/\(\{\{bbox\}\}\)/g, '');
        }

        return `[out:json][timeout:180][maxsize:${size}];${finalRequest}`;
    }

    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} request - An OverPass request to prepare for web.
     * @return {string}
     */
    static buildRequestForTheme (request) {
        let overPassRequest = '';
        const requestSplit = request
        .trim()
        .replace(/\[(out|timeout):\w+\]/g, '')
        .split(';');

        for (let row of requestSplit) {
            row = row.trim();

            if ( !row ) {
                continue;
            }

            const split = row.split(' ');

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
