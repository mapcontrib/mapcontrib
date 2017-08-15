import 'babel-polyfill';
import OsmEditHelper from './osmEdit';

describe('OsmEditHelper', () => {
  describe('_buildChangesetXML', () => {
    test('Should return a serialized changeset XML', () => {
      const expected =
        '<osm><changeset><tag k="created_by" v="a string"/><tag k="comment" v="another string"/></changeset></osm>';

      const osmEdit = new OsmEditHelper();

      osmEdit.setChangesetCreatedBy('a string');
      osmEdit.setChangesetComment('another string');

      const returnedXml = osmEdit._buildChangesetXml();

      expect(returnedXml).toBe(expected);
    });
  });

  describe('_buildXml', () => {
    test('Should return a serialized node XML', () => {
      const expected =
        '<osm><node version="0" lat="42.3" lon="0.2" uid="3569284" timestamp="2016-03-24T12:21:30.546Z" display_name="Walter White" changeset="85964251"><tag k="a key" v="a value"/><tag k="another key" v="another value"/></node></osm>';

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('node');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });

      const returnedXml = osmEdit._buildXml(85964251);

      expect(returnedXml).toBe(expected);
    });

    test('Should return a serialized way XML', () => {
      const expected =
        '<osm><way version="0" lat="42.3" lon="0.2" uid="3569284" timestamp="2016-03-24T12:21:30.546Z" display_name="Walter White" changeset="85964251"><tag k="a key" v="a value"/><tag k="another key" v="another value"/><nd ref="1"/><nd ref="37"/><nd ref="6"/></way></osm>';

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('way');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setNodes([1, 37, 6]);

      const returnedXml = osmEdit._buildXml(85964251);

      expect(returnedXml).toBe(expected);
    });

    test('Should return a serialized relation XML', () => {
      const expected =
        '<osm><relation version="0" lat="42.3" lon="0.2" uid="3569284" timestamp="2016-03-24T12:21:30.546Z" display_name="Walter White" changeset="85964251"><tag k="a key" v="a value"/><tag k="another key" v="another value"/><member type="relation" ref="1745069"/></relation></osm>';

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('relation');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setMembers([
        {
          type: 'relation',
          ref: 1745069,
          role: ''
        }
      ]);

      const returnedXml = osmEdit._buildXml(85964251);

      expect(returnedXml).toBe(expected);
    });
  });

  describe('getOverPassElement', () => {
    test('Should return an OverPass version of the OSM node', () => {
      const expected = {
        display_name: 'Walter White',
        lat: 42.3,
        lon: 0.2,
        tags: {
          'a key': 'a value',
          'another key': 'another value'
        },
        timestamp: '2016-03-24T12:21:30.546Z',
        type: 'node',
        uid: 3569284,
        version: 0
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('node');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });

      const returnedObject = osmEdit.getOverPassElement();

      expect(returnedObject).toEqual(expected);
    });

    test('Should return an OverPass version of the OSM way', () => {
      const expected = {
        display_name: 'Walter White',
        lat: 42.3,
        lon: 0.2,
        tags: {
          'a key': 'a value',
          'another key': 'another value'
        },
        nodes: [1, 37, 6],
        timestamp: '2016-03-24T12:21:30.546Z',
        type: 'way',
        uid: 3569284,
        version: 0
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('way');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setNodes([1, 37, 6]);

      const returnedObject = osmEdit.getOverPassElement();

      expect(returnedObject).toEqual(expected);
    });

    test('Should return an OverPass version of the OSM relation', () => {
      const expected = {
        display_name: 'Walter White',
        lat: 42.3,
        lon: 0.2,
        tags: {
          'a key': 'a value',
          'another key': 'another value'
        },
        members: [
          {
            type: 'relation',
            ref: 1745069,
            role: ''
          }
        ],
        timestamp: '2016-03-24T12:21:30.546Z',
        type: 'relation',
        uid: 3569284,
        version: 0
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('relation');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setMembers([
        {
          type: 'relation',
          ref: 1745069,
          role: ''
        }
      ]);

      const returnedObject = osmEdit.getOverPassElement();

      expect(returnedObject).toEqual(expected);
    });
  });

  describe('getElement', () => {
    test('Should return the OSM node', () => {
      const expected = {
        type: 'node',
        attributes: {
          display_name: 'Walter White',
          lat: 42.3,
          lon: 0.2,
          timestamp: '2016-03-24T12:21:30.546Z',
          uid: 3569284,
          version: 0
        },
        tags: [
          {
            k: 'a key',
            v: 'a value'
          },
          {
            k: 'another key',
            v: 'another value'
          }
        ]
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('node');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });

      const returnedObject = osmEdit.getElement();

      expect(returnedObject).toEqual(expected);
    });

    test('Should return the OSM way', () => {
      const expected = {
        type: 'way',
        attributes: {
          display_name: 'Walter White',
          lat: 42.3,
          lon: 0.2,
          timestamp: '2016-03-24T12:21:30.546Z',
          uid: 3569284,
          version: 0
        },
        tags: [
          {
            k: 'a key',
            v: 'a value'
          },
          {
            k: 'another key',
            v: 'another value'
          }
        ],
        nodes: [1, 37, 6]
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('way');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setNodes([1, 37, 6]);

      const returnedObject = osmEdit.getElement();

      expect(returnedObject).toEqual(expected);
    });

    test('Should return the OSM relation', () => {
      const expected = {
        type: 'relation',
        attributes: {
          display_name: 'Walter White',
          lat: 42.3,
          lon: 0.2,
          timestamp: '2016-03-24T12:21:30.546Z',
          uid: 3569284,
          version: 0
        },
        tags: [
          {
            k: 'a key',
            v: 'a value'
          },
          {
            k: 'another key',
            v: 'another value'
          }
        ],
        members: [
          {
            type: 'relation',
            ref: 1745069,
            role: ''
          }
        ]
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('relation');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setMembers([
        {
          type: 'relation',
          ref: 1745069,
          role: ''
        }
      ]);

      const returnedObject = osmEdit.getElement();

      expect(returnedObject).toEqual(expected);
    });
  });

  describe('hydrateOverPassObject', () => {
    test("Should return an OverPass object hydrated with an OSM node's attributes", () => {
      const expected = {
        display_name: 'Walter White',
        lat: 42.3,
        lon: 0.2,
        tags: {
          'a key': 'a value',
          'another key': 'another value'
        },
        timestamp: '2016-03-24T12:21:30.546Z',
        type: 'node',
        uid: 3569284,
        version: 0
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('node');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });

      const returnedObject = osmEdit.hydrateOverPassObject({});

      expect(returnedObject).toEqual(expected);
    });

    test("Should return an OverPass object hydrated with an OSM way's attributes", () => {
      const expected = {
        display_name: 'Walter White',
        lat: 42.3,
        lon: 0.2,
        tags: {
          'a key': 'a value',
          'another key': 'another value'
        },
        nodes: [1, 37, 6],
        timestamp: '2016-03-24T12:21:30.546Z',
        type: 'way',
        uid: 3569284,
        version: 0
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('way');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setNodes([1, 37, 6]);

      const returnedObject = osmEdit.hydrateOverPassObject({});

      expect(returnedObject).toEqual(expected);
    });

    test("Should return an OverPass object hydrated with an OSM relation's attributes", () => {
      const expected = {
        display_name: 'Walter White',
        lat: 42.3,
        lon: 0.2,
        tags: {
          'a key': 'a value',
          'another key': 'another value'
        },
        members: [
          {
            type: 'relation',
            ref: 1745069,
            role: ''
          }
        ],
        timestamp: '2016-03-24T12:21:30.546Z',
        type: 'relation',
        uid: 3569284,
        version: 0
      };

      const osmEdit = new OsmEditHelper();

      osmEdit.setType('relation');
      osmEdit.setVersion(0);
      osmEdit.setLatitude(42.3);
      osmEdit.setLongitude(0.2);
      osmEdit.setUid(3569284);
      osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
      osmEdit.setDisplayName('Walter White');
      osmEdit.setTags({
        'a key': 'a value',
        'another key': 'another value'
      });
      osmEdit.setMembers([
        {
          type: 'relation',
          ref: 1745069,
          role: ''
        }
      ]);

      const returnedObject = osmEdit.hydrateOverPassObject({});

      expect(returnedObject).toEqual(expected);
    });
  });
});
