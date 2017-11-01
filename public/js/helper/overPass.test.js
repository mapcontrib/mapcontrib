import 'babel-polyfill';
import OverPassHelper from './overPass';

describe('OverPassHelper', () => {
  describe('buildRequestForTheme', () => {
    test('Should return an OverPass request built for the theme', () => {
      const request = `(
                node[amenity=recycling]({{bbox}});
                way[amenity=recycling]({{bbox}});
                relation[amenity=recycling]({{bbox}});
                );
                (._;>;);
                out body;`;
      const expected = `(
                node[amenity=recycling]({{bbox}});way[amenity=recycling]({{bbox}});relation[amenity=recycling]({{bbox}}););(._;>;);out  center meta;`;

      const result = OverPassHelper.buildRequestForTheme(request);
      expect(expected).toBe(result);
    });

    test('Should remove body and add center and meta', () => {
      const request = 'way[amenity=recycling]({{bbox}}); out body;';
      const expected = 'way[amenity=recycling]({{bbox}});out  center meta;';

      const result = OverPassHelper.buildRequestForTheme(request);
      expect(expected).toBe(result);
    });
  });

  describe('buildRequestForCache', () => {
    test('Should return an OverPass request built for the cache cron job', () => {
      const request = 'way[amenity=recycling]({{bbox}}); out body;';
      const expected =
        '[out:json][timeout:180][maxsize:1024];way[amenity=recycling];out  center meta;';
      const size = 1024;

      const result = OverPassHelper.buildRequestForCache(request, size);
      expect(expected).toBe(result);
    });
  });

  describe('buildUrlForCache', () => {
    test('Should return a complete OverPass url to build the cache', () => {
      const endPoint = 'http://overpass-api.de/api/';
      const request = 'way[amenity=recycling]({{bbox}}); out body;';
      const size = 1024;
      const expected =
        'http://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A180%5D%5Bmaxsize%3A1024%5D%3Bway%5Bamenity%3Drecycling%5D%3Bout%20%20center%20meta%3B';

      const result = OverPassHelper.buildUrlForCache(endPoint, request, size);
      expect(expected).toBe(result);
    });
  });
});
