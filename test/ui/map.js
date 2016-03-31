
import 'babel-polyfill';
import assert from 'assert';

import CONST from '../../src/public/js/const';
import MapUi from '../../src/public/js/ui/map';
import PoiLayerModel from '../../src/public/js/model/poiLayer';



describe('MapUi', () => {

    describe('_buildPoiLayerIconOptions', () => {

        it('Should return icon options (icon type: library)', () => {

            const expected = {
                iconSize: [ 36, 42 ],
                iconAnchor: [ 18, 42 ],
                popupAnchor: [ 0, -38 ],
                className: 'marker marker-2 purple',
                html: '<i class="fa fa-star fa-fw"></i>'
            };

            let poiLayerModel = new PoiLayerModel({
                'markerShape': 'marker2',
                'markerIcon': 'star',
                'markerIconType': CONST.map.markerIconType.library,
                'markerColor': 'purple',
            });

            let returnedOptions = MapUi._buildPoiLayerIconOptions(poiLayerModel);

            assert.deepEqual(expected, returnedOptions);
        });

        it('Should return icon options (icon type: external)', () => {

            const expected = {
                iconSize: [ 36, 42 ],
                iconAnchor: [ 18, 42 ],
                popupAnchor: [ 0, -38 ],
                className: 'marker marker-3 yellow',
                html: '<img src="http://myiconfromtheweb" class="external-icon">'
            };

            let poiLayerModel = new PoiLayerModel({
                'markerShape': 'marker3',
                'markerIconUrl': 'http://myiconfromtheweb',
                'markerIconType': CONST.map.markerIconType.external,
                'markerColor': 'yellow',
            });

            let returnedOptions = MapUi._buildPoiLayerIconOptions(poiLayerModel);

            assert.deepEqual(expected, returnedOptions);
        });
    });

    describe('buildPoiLayerHtmlIcon', () => {

        it('Should return a complete html icon', () => {

            const expected = `<div class="marker marker-2 purple"><i class="fa fa-star fa-fw"></i></div>`;

            let poiLayerModel = new PoiLayerModel({
                'markerShape': 'marker2',
                'markerIcon': 'star',
                'markerIconType': CONST.map.markerIconType.library,
                'markerColor': 'purple',
            });

            let returnedHtml = MapUi.buildPoiLayerHtmlIcon(poiLayerModel);

            assert.strictEqual(expected, returnedHtml);
        });
    });
});
