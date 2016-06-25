
import { saveAs } from 'file-saver';


export default class LeafletHelper {
    static downloadGeoJsonFromLayer (layer, fileName) {
        const blob = new Blob(
            [ JSON.stringify( layer.toGeoJSON() ) ],
            { 'type' : 'application/vnd.geo+json' }
        );

        saveAs(blob, fileName);
    }
}
