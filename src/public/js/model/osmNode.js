
import _ from 'underscore';
import Backbone from 'backbone';


export default Backbone.Model.extend({
    defaults: {
        'id': undefined,
        'type': 'node',
        'version': 0,
        'timestamp': new Date().toISOString(),
        'lat': undefined,
        'lon': undefined,
        'tags': [], // [{'key': '', 'value': ''}, [...]]
    }
});
