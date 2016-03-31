
import 'babel-polyfill';
import assert from 'assert';

import CONST from '../../src/public/js/const';
import MapUi from '../../src/public/js/ui/map';
import PoiLayerModel from '../../src/public/js/model/poiLayer';



describe('MapUi', () => {

    describe('_buildPoiLayerIconOptions', () => {

        it('should return icon options (icon type: library)', () => {

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
    });
});
