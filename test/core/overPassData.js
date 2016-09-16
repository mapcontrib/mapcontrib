
import 'babel-polyfill';
import assert from 'assert';

import OverPassData from 'core/overPassData';



describe('OverPassData', () => {
    describe('exists', () => {
        it('Should tell if an element exists', () => {
            const osmNode = {
                type: 'node',
                id: '1234'
            };

            const osmWay = {
                type: 'way',
                id: '1234'
            };

            const overPassData = new OverPassData();

            let nodeExists = overPassData.exists(osmNode.type, osmNode.id);
            assert.strictEqual(nodeExists, false);

            let wayExists = overPassData.exists(osmWay.type, osmWay.id);
            assert.strictEqual(wayExists, false);

            overPassData.save(osmNode);

            nodeExists = overPassData.exists(osmNode.type, osmNode.id);
            assert.strictEqual(nodeExists, true);

            wayExists = overPassData.exists(osmWay.type, osmWay.id);
            assert.strictEqual(wayExists, false);

            overPassData.save(osmWay);

            nodeExists = overPassData.exists(osmNode.type, osmNode.id);
            assert.strictEqual(nodeExists, true);

            wayExists = overPassData.exists(osmWay.type, osmWay.id);
            assert.strictEqual(wayExists, true);

        });
    });

    describe('get', () => {
        it('Should return a saved element', () => {
            const osmNode = {
                type: 'node',
                id: '1234'
            };

            const osmWay = {
                type: 'way',
                id: '1234'
            };

            const overPassData = new OverPassData();
            overPassData.save(osmNode);

            let node = overPassData.get(osmNode.type, osmNode.id);
            assert.deepEqual(node, osmNode);

            let way = overPassData.get(osmWay.type, osmWay.id);
            assert.strictEqual(way, undefined);

            overPassData.save(osmWay);

            node = overPassData.get(osmNode.type, osmNode.id);
            assert.deepEqual(node, osmNode);

            way = overPassData.get(osmWay.type, osmWay.id);
            assert.deepEqual(way, osmWay);
        });
    });
});
