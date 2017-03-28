
import Backbone from 'backbone';
import UserFavoriteThemesDataModel from '../model/userFavoriteThemesData';


export default Backbone.Collection.extend({
    model: UserFavoriteThemesDataModel,
});
