
import Backbone from 'backbone';
import CONST from '../const';
import UserThemeModel from '../model/userTheme';


export default Backbone.Collection.extend({
    url: `${CONST.apiPath}/userTheme`,

    model: UserThemeModel,
});
