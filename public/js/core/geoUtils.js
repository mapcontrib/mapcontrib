// From https://github.com/kosmtik/kosmtik/blob/1533efde3bd2f5246eb04e7bc9c273314efbac7d/src/back/GeoUtils.js

/* eslint-disable */
export default class GeoUtils {
    static zoomXYToLatLng(z, x, y) {
        let n = Math.pow(2.0, z),
            lonDeg = x / n * 360.0 - 180.0,
            latRad = Math.atan(GeoUtils._sinh(Math.PI * (1 - 2 * y / n))),
            latDeg = latRad * 180.0 / Math.PI;
        return [latDeg, lonDeg];
    }

    static zoomLatLngToXY(z, lat, lng) {
        const xy = GeoUtils.zoomLatLngToFloatXY(z, lat, lng);
        return [Math.floor(xy[0]), Math.floor(xy[1])];
    }

    static zoomLatLngToFloatXY(z, lat, lng) {
        let n = Math.pow(2.0, z),
            latRad = lat / 180.0 * Math.PI,
            y = (1.0 - Math.log(Math.tan(latRad) + (1 / Math.cos(latRad))) / Math.PI) / 2.0 * n,
            x = ((lng + 180.0) / 360.0) * n;
        return [x, y];
    }

    static _sinh(x) {
        const y = Math.exp(x);
        return (y - 1 / y) / 2;
    }

    static zoomLatLngWidthHeightToBbox(zoom, lat, lng, width, height) {
        const tileSize = 256;

        const tile = GeoUtils.zoomLatLngToXY(zoom, lat, lng);

        const xTile_s = (tile[0] * tileSize - width / 2) / tileSize;
        const yTile_s = (tile[1] * tileSize - height / 2) / tileSize;
        const xTile_e = (tile[0] * tileSize + width / 2) / tileSize;
        const yTile_e = (tile[1] * tileSize + height / 2) / tileSize;

        const s = GeoUtils.zoomXYToLatLng(zoom, xTile_s, yTile_s);
        const e = GeoUtils.zoomXYToLatLng(zoom, xTile_e, yTile_e);

        return {
            _southWest: {
                lat: e[0],
                lng: s[1],
            },
            _northEast: {
                lat: s[0],
                lng: e[1],
            },
        };
    }
}
/* eslint-enable */
