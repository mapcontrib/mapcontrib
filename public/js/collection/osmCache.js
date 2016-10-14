
import Backbone from 'backbone';
import OsmCacheModel from '../model/osmCache';
import CONST from '../const';


export default Backbone.Collection.extend({
    url: `${CONST.apiPath}/osmCache`,

    model: OsmCacheModel,
});
