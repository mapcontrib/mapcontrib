
import Backbone from 'backbone';
import NonOsmDataModel from '../model/nonOsmData';
import CONST from 'const';


export default Backbone.Collection.extend({
    url: `${CONST.apiPath}/nonOsmData`,

    model: NonOsmDataModel,
});
