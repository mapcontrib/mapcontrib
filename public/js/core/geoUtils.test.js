import 'babel-polyfill';
import GeoUtils from 'core/geoUtils';

describe('GeoUtils', () => {
  describe('zoomXYToLatLng', () => {
    test('Should return a latitude and a longitude', () => {
      const expected = [81.72318761821157, -140.2734375];

      const result = GeoUtils.zoomXYToLatLng(10, 113, 84);

      expect(result).toEqual(expected);
    });
  });

  describe('zoomLatLngToXY', () => {
    test('Should return XY values', () => {
      const expected = [443, 510];

      const result = GeoUtils.zoomLatLngToXY(10, 0.568, -24.196);

      expect(result).toEqual(expected);
    });
  });

  describe('zoomLatLngToFloatXY', () => {
    test('Should return XY values', () => {
      const expected = [443.1758222222222, 510.3843290914867];

      const result = GeoUtils.zoomLatLngToFloatXY(10, 0.568, -24.196);

      expect(result).toEqual(expected);
    });
  });

  describe('_sinh', () => {
    test('Should return an hyperbolic sine', () => {
      const expected = 3.626860407847019;

      const result = GeoUtils._sinh(2);

      expect(result).toBe(expected);
    });
  });

  describe('kilometersToLatitudeDegrees', () => {
    test('Should return the valid latitude', () => {
      const result = GeoUtils.kilometersToLatitudeDegrees(2345);

      expect(result).toBe(21.065397053539346);
    });
  });

  describe('kilometersToLongitudeDegrees', () => {
    test('Should return the valid longitude', () => {
      const result1 = GeoUtils.kilometersToLongitudeDegrees(2345, 0);
      const result2 = GeoUtils.kilometersToLongitudeDegrees(2345, 23);
      const result3 = GeoUtils.kilometersToLongitudeDegrees(2345, 75);
      const result4 = GeoUtils.kilometersToLongitudeDegrees(1, 88);

      expect(result1).toBe(13.425732731260641);
      expect(result2).toBe(14.58518407687495);
      expect(result3).toBe(51.87304792791651);
      expect(result4).toBe(0.16404990619942084);
    });
  });

  describe('calculateDistance', () => {
    test('Should return the valid distance', () => {
      const result1 = GeoUtils.calculateDistance(10, 10, 20, 20);
      const result2 = GeoUtils.calculateDistance(45, 10, 45, 20);

      expect(result1).toBe(1544.7575610296099);
      expect(result2).toBe(785.7672208422621);
    });
  });

  describe('toRadian', () => {
    test('Should return the valid radian', () => {
      const result1 = GeoUtils.toRadian(13);
      const result2 = GeoUtils.toRadian(77);

      expect(result1).toBe(0.22689280275926285);
      expect(result2).toBe(1.3439035240356338);
    });
  });

  describe('toDegree', () => {
    test('Should return the valid angle', () => {
      const result1 = GeoUtils.toDegree(0.5);
      const result2 = GeoUtils.toDegree(0.77);

      expect(result1).toBe(28.64788975654116);
      expect(result2).toBe(44.11775022507339);
    });
  });
});
