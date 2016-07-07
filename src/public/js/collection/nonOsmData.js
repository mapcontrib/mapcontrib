
import Backbone from 'backbone';
import NonOsmDataModel from '../model/nonOsmData';


export default Backbone.Collection.extend({
    model: NonOsmDataModel,
});
