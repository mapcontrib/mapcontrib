
import L from 'leaflet';
import { saveAs } from 'file-saver';


export default class LeafletHelper {
    static downloadGeoJsonFromLayer(layer, fileName) {
        const blob = new Blob(
            [ JSON.stringify( layer.toGeoJSON() ) ],
            { type: 'application/vnd.geo+json' }
        );

        saveAs(blob, fileName);
    }

    static downloadGeoJsonFromBbox(map, fileName) {
        const mapBounds = map.getBounds();
        const layerGroup = L.layerGroup();

        map.eachLayer((layer) => {
            if (layer._markerCluster) {
                layer.eachLayer((l) => {
                    if ( !l.getBounds ) {
                        const position = l.getLatLng();

                        if ( mapBounds.contains(position) ) {
                            layerGroup.addLayer(l);
                        }
                    }
                    else {
                        const bounds = l.getBounds();

                        if ( mapBounds.contains(bounds) || mapBounds.intersects(bounds) ) {
                            layerGroup.addLayer(l);
                        }
                    }
                });
            }
        });

        LeafletHelper.downloadGeoJsonFromLayer(layerGroup, fileName);
    }
}
