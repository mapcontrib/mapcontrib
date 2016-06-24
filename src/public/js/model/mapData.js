
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        'dataSource': undefined,
        'osmId': undefined,
        'element': undefined, // Raw foreign element
        'object': undefined, // Leaflet object
        'layerId': undefined,
        'isMarker': false,
        'isPolygon': false,
        'isPolyline': false,
        'isRootLayer': false,
        'isMarkerCluster': false,
        'isOverPassLayer': false,
        'tags': [],
    },
});
