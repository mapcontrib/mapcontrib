
import 'babel-polyfill';
import assert from 'assert';

import OsmData from '../../src/public/js/core/osmData';



describe('OsmData', () => {
    describe('exists', () => {
        it('Should tell if an element exists', () => {
            const osmNode = {
                'type': 'node',
                'id': '1234'
            };

            const osmWay = {
                'type': 'way',
                'id': '1234'
            };

            let osmData = new OsmData();

            let nodeExists = osmData.exists(osmNode.type, osmNode.id);
            assert.strictEqual(nodeExists, false);

            let wayExists = osmData.exists(osmWay.type, osmWay.id);
            assert.strictEqual(wayExists, false);

            osmData.save(osmNode);

            nodeExists = osmData.exists(osmNode.type, osmNode.id);
            assert.strictEqual(nodeExists, true);

            wayExists = osmData.exists(osmWay.type, osmWay.id);
            assert.strictEqual(wayExists, false);

            osmData.save(osmWay);

            nodeExists = osmData.exists(osmNode.type, osmNode.id);
            assert.strictEqual(nodeExists, true);

            wayExists = osmData.exists(osmWay.type, osmWay.id);
            assert.strictEqual(wayExists, true);

        });
    });

    describe('get', () => {
        it('Should return a saved element', () => {
            const osmNode = {
                'type': 'node',
                'id': '1234'
            };

            const osmWay = {
                'type': 'way',
                'id': '1234'
            };

            let osmData = new OsmData();
            osmData.save(osmNode);

            let node = osmData.get(osmNode.type, osmNode.id);
            assert.deepEqual(node, osmNode);

            let way = osmData.get(osmWay.type, osmWay.id);
            assert.strictEqual(way, undefined);

            osmData.save(osmWay);

            node = osmData.get(osmNode.type, osmNode.id);
            assert.deepEqual(node, osmNode);

            way = osmData.get(osmWay.type, osmWay.id);
            assert.deepEqual(way, osmWay);
        });
    });
});
