// From https://github.com/kosmtik/kosmtik/blob/1533efde3bd2f5246eb04e7bc9c273314efbac7d/src/back/GeoUtils.js

/* eslint-disable */
export default class GeoUtils {
  static earthRadius = 6371;
  static earthDiameter = GeoUtils.earthRadius * 2;
  static earthPerimeter = GeoUtils.earthDiameter * Math.PI;

  static zoomXYToLatLng(z, x, y) {
    const n = Math.pow(2.0, z);
    const lonDeg = x / n * 360.0 - 180.0;
    const latRad = Math.atan(GeoUtils._sinh(Math.PI * (1 - 2 * y / n)));
    const latDeg = GeoUtils.toDegree(latRad);
    return [latDeg, lonDeg];
  }

  static zoomLatLngToXY(z, lat, lng) {
    const xy = GeoUtils.zoomLatLngToFloatXY(z, lat, lng);
    return [Math.floor(xy[0]), Math.floor(xy[1])];
  }

  static zoomLatLngToFloatXY(z, lat, lng) {
    const n = Math.pow(2.0, z);
    const latRad = GeoUtils.toRadian(lat);
    const y =
      (1.0 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
      2.0 *
      n;
    const x = (lng + 180.0) / 360.0 * n;
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
        lat: GeoUtils.hasToBeInRange(e[0], -90, 90),
        lng: GeoUtils.hasToBeInRange(s[1], -180, 180)
      },
      _northEast: {
        lat: GeoUtils.hasToBeInRange(s[0], -90, 90),
        lng: GeoUtils.hasToBeInRange(e[1], -180, 180)
      }
    };
  }

  static hasToBeInRange(value, min, max) {
    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
  }

  /**
   * Convert a number of kilometers into a number of latitude degrees.
   * @param {number} kilometers
   * @return {number}
   */
  static kilometersToLatitudeDegrees(kilometers) {
    const oneLatitudeDegreeInKilometers = 111.32;
    return kilometers / oneLatitudeDegreeInKilometers;
  }

  /**
   * Convert a number of kilometers into a number of longitude degrees.
   * Also, to calculate a longitude, you have to base it on a latitude position.
   * @param {number} kilometers
   * @param {number} latitude
   * @return {number}
   */
  static kilometersToLongitudeDegrees(kilometers, latitude) {
    const oneLongitudeDegreeInKilometers =
      GeoUtils.earthPerimeter * Math.cos(GeoUtils.toRadian(latitude)) / 360.0;
    return kilometers / oneLongitudeDegreeInKilometers;
  }

  /**
   * Calculate the distance in kilometers between to coordinates.
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @return {number}
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = GeoUtils.earthRadius; // km
    const dLat = GeoUtils.toRadian(lat2 - lat1);
    const dLon = GeoUtils.toRadian(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(GeoUtils.toRadian(lat1)) *
        Math.cos(GeoUtils.toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  /**
   * Convert degrees into radians.
   * @param {number} degree
   * @return {number}
   */
  static toRadian(degree) {
    return degree * Math.PI / 180.0;
  }

  /**
   * Convert radians into degrees.
   * @param {number} radian
   * @return {number}
   */
  static toDegree(radian) {
    return radian * 180.0 / Math.PI;
  }
}
/* eslint-enable */
