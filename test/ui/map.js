
import 'babel-polyfill';
import assert from 'assert';

import CONST from 'const';
import MapUi from 'ui/map';
import LayerModel from 'model/layer';


describe('MapUi', () => {
    describe('buildMarkerLayerIconOptions', () => {
        it('Should return icon options (icon type: library)', () => {
            const expected = {
                iconSize: [ 36, 42 ],
                iconAnchor: [ 18, 40 ],
                popupAnchor: [ 0, -36 ],
                className: 'marker marker-2 purple',
                html: '<i class="fa fa-star fa-fw"></i>',
            };

            const layerModel = new LayerModel({
                markerShape: 'marker2',
                markerIcon: 'star',
                markerIconType: CONST.map.markerIconType.library,
                markerColor: 'purple',
            });

            const returnedOptions = MapUi.buildMarkerLayerIconOptions(layerModel);

            assert.deepEqual(returnedOptions, expected);
        });

        it('Should return icon options (icon type: external)', () => {
            const expected = {
                iconSize: [ 36, 42 ],
                iconAnchor: [ 18, 40 ],
                popupAnchor: [ 0, -36 ],
                className: 'marker marker-3 yellow',
                html: '<img src="http://myiconfromtheweb" class="external-icon">',
            };

            const layerModel = new LayerModel({
                markerShape: 'marker3',
                markerIconUrl: 'http://myiconfromtheweb',
                markerIconType: CONST.map.markerIconType.external,
                markerColor: 'yellow',
            });

            const returnedOptions = MapUi.buildMarkerLayerIconOptions(layerModel);

            assert.deepEqual(returnedOptions, expected);
        });
    });

    describe('buildLayerHtmlIcon', () => {
        it('Should return a complete html icon', () => {
            const expected = '<div class="marker marker-2 purple"><i class="fa fa-star fa-fw"></i></div>';

            const layerModel = new LayerModel({
                markerShape: 'marker2',
                markerIcon: 'star',
                markerIconType: CONST.map.markerIconType.library,
                markerColor: 'purple',
            });

            const returnedHtml = MapUi.buildLayerHtmlIcon(layerModel);

            assert.strictEqual(returnedHtml, expected);
        });
    });
});
