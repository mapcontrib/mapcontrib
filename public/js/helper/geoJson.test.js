import 'babel-polyfill';
import GeoJsonHelper from './geoJson';

describe('GeoJsonHelper', () => {
  const geoJsonObject = {
    geometry: {},
    id: 'node/1234',
    type: 'feature',
    properties: {
      id: 1234,
      type: 'node',
      meta: {
        changeset: 654564654,
        timestamp: '',
        uid: 9879,
        user: 'qdlfjkh',
        version: 23
      }
    }
  };

  describe('findOsmId', () => {
    test('Should find and return an OSM element id from a geoJson object', () => {
      const expected = 1234;
      const result = GeoJsonHelper.findOsmId(geoJsonObject);

      expect(expected).toBe(result);
    });
  });

  describe('findOsmType', () => {
    test('Should find and return an OSM element type from a geoJson object', () => {
      const expected = 'node';
      const result = GeoJsonHelper.findOsmType(geoJsonObject);

      expect(expected).toBe(result);
    });
  });

  describe('findOsmVersion', () => {
    test('Should find and return an OSM element version from a geoJson object', () => {
      const expected = 23;
      const result = GeoJsonHelper.findOsmVersion(geoJsonObject);

      expect(expected).toBe(result);
    });
  });
});
