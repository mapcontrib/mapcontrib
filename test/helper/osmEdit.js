var assert = require('assert'),
osmEdit = require('../../src/public/js/helper/osmEdit.js');


describe('osmEdit helper', function() {

    describe('buildChangesetXML', function () {

        it('should return a serialized changeset XML', function () {

            var expected = '<osm><changeset><tag k="created_by" v="a string"/><tag k="comment" v="another string"/></changeset></osm>',
            returnedXml = osmEdit.buildChangesetXml('a string', 'another string');

            assert.strictEqual(expected, returnedXml);
        });
    });
});
