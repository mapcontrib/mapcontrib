// From https://github.com/kosmtik/kosmtik/blob/1533efde3bd2f5246eb04e7bc9c273314efbac7d/src/back/GeoUtils.js

export default class GeoUtils {
    static zoomXYToLatLng (z, x, y) {
        let n = Math.pow(2.0, z),
            lonDeg = x / n * 360.0 - 180.0,
            latRad = Math.atan(GeoUtils._sinh(Math.PI * (1 - 2 * y / n))),
            latDeg = latRad * 180.0 / Math.PI;
        return [lonDeg, latDeg];
    }

    static zoomLatLngToXY (z, lat, lng) {
        let xy = GeoUtils.zoomLatLngToFloatXY(z, lat, lng);
        return [Math.floor(xy[0]), Math.floor(xy[1])];
    }

    static zoomLatLngToFloatXY (z, lat, lng) {
        let n = Math.pow(2.0, z),
            latRad = lat / 180.0 * Math.PI,
            y = (1.0 - Math.log(Math.tan(latRad) + (1 / Math.cos(latRad))) / Math.PI) / 2.0 * n,
            x = ((lng + 180.0) / 360.0) * n;
        return [x, y];
    }

    static _sinh (x) {
        let y = Math.exp(x);
        return (y - 1/y) / 2;
    }
}
