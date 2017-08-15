
import 'babel-polyfill';

import OverPassData from './overPassData';


describe('OverPassData', () => {
    describe('exists', () => {
        test('Should tell if an element exists', () => {
            const osmNode = {
                type: 'node',
                id: '1234',
            };

            const osmWay = {
                type: 'way',
                id: '1234',
            };

            const overPassData = new OverPassData();

            let nodeExists = overPassData.exists(osmNode.type, osmNode.id);
            expect(nodeExists).toBe(false);

            let wayExists = overPassData.exists(osmWay.type, osmWay.id);
            expect(wayExists).toBe(false);

            overPassData.save(osmNode);

            nodeExists = overPassData.exists(osmNode.type, osmNode.id);
            expect(nodeExists).toBe(true);

            wayExists = overPassData.exists(osmWay.type, osmWay.id);
            expect(wayExists).toBe(false);

            overPassData.save(osmWay);

            nodeExists = overPassData.exists(osmNode.type, osmNode.id);
            expect(nodeExists).toBe(true);

            wayExists = overPassData.exists(osmWay.type, osmWay.id);
            expect(wayExists).toBe(true);
        });
    });

    describe('get', () => {
        test('Should return a saved element', () => {
            const osmNode = {
                type: 'node',
                id: '1234',
            };

            const osmWay = {
                type: 'way',
                id: '1234',
            };

            const overPassData = new OverPassData();
            overPassData.save(osmNode);

            let node = overPassData.get(osmNode.type, osmNode.id);
            expect(node).toEqual(osmNode);

            let way = overPassData.get(osmWay.type, osmWay.id);
            expect(way).toBe(undefined);

            overPassData.save(osmWay);

            node = overPassData.get(osmNode.type, osmNode.id);
            expect(node).toEqual(osmNode);

            way = overPassData.get(osmWay.type, osmWay.id);
            expect(way).toEqual(osmWay);
        });
    });
});
