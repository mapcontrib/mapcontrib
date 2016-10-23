
import Backbone from 'backbone';
import CONST from '../const';
import ThemeModel from '../model/theme';


export default Backbone.Collection.extend({
    url: `${CONST.apiPath}/theme`,

    model: ThemeModel,
});
