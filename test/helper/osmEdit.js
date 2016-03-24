
import 'babel-polyfill';
import assert from 'assert';
import OsmEditHelper from '../../src/public/js/helper/osmEdit.js';



describe('osmEdit helper', () => {

    describe('_buildChangesetXML', () => {

        it('should return a serialized changeset XML', () => {

            const expected = '<osm><changeset><tag k="created_by" v="a string"/><tag k="comment" v="another string"/></changeset></osm>';

            let osmEdit = new OsmEditHelper();

            osmEdit.setChangesetCreatedBy('a string');
            osmEdit.setChangesetComment('another string');
            // osmEdit.setLatitude(this.model.get('lat'));
            // osmEdit.setLongitude(this.model.get('lng'));
            // osmEdit.setTags(this.model.get('tags'));
            // osmEdit.setUid(this._user.get('osmId'));
            // osmEdit.setDisplayName(this._user.get('displayName'));


            let returnedXml = osmEdit._buildChangesetXml();

            assert.strictEqual(expected, returnedXml);
        });
    });

    describe('_buildNodeXml', () => {

        it('should return a serialized node XML', () => {

            const expected = '<osm><node changeset="85964251" timestamp="2016-03-24T12:21:30.546Z" uid="3569284" display_name="Walter White" lat="42.3" lon="0.2"><tag k="a key" v="a value"/><tag k="another key" v="another value"/></node></osm>';

            let osmEdit = new OsmEditHelper();

            osmEdit.setLatitude(42.3);
            osmEdit.setLongitude(0.2);
            osmEdit.setUid(3569284);
            osmEdit.setTimestamp('2016-03-24T12:21:30.546Z');
            osmEdit.setDisplayName('Walter White');
            osmEdit.setTags([
                {
                    'key': 'a key',
                    'value': 'a value'
                },
                {
                    'key': 'another key',
                    'value': 'another value'
                }
            ]);


            let returnedXml = osmEdit._buildNodeXml(85964251);

            assert.strictEqual(expected, returnedXml);
        });
    });
});
