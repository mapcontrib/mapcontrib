
import 'babel-polyfill';
import assert from 'assert';
import OsmEditHelper from '../../src/public/js/helper/osmEdit.js';



describe('osmEdit helper', () => {

    describe('buildChangesetXML', () => {

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
});
