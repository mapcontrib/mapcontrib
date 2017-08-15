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
});
