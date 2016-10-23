
import Backbone from 'backbone';
import CONST from '../const';
import UserModel from '../model/user';


export default Backbone.Collection.extend({
    url: `${CONST.apiPath}/user`,

    model: UserModel,
});
