
import L from 'leaflet';
import { saveAs } from 'file-saver';


export default class LeafletHelper {
    static downloadGeoJsonFromLayer (layer, fileName) {
        const blob = new Blob(
            [ JSON.stringify( layer.toGeoJSON() ) ],
            { 'type' : 'application/vnd.geo+json' }
        );

        saveAs(blob, fileName);
    }

    static downloadGeoJsonFromBbox (map, fileName) {
        const mapBounds = map.getBounds();
        const layerGroup = L.layerGroup();

        map.eachLayer((layer) => {
            if (layer._markerCluster) {
                layer.eachLayer((layer) => {
                    if ( !layer.getBounds ) {
                        const position = layer.getLatLng();

                        if ( mapBounds.contains(position) ) {
                            layerGroup.addLayer(layer);
                        }
                    }
                    else {
                        const bounds = layer.getBounds();

                        if ( mapBounds.contains(bounds) || mapBounds.intersects(bounds) ) {
                            layerGroup.addLayer(layer);
                        }
                    }

                });
            }
        });

        LeafletHelper.downloadGeoJsonFromLayer(layerGroup, fileName);
    }
}
