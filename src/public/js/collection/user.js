
import Backbone from 'backbone';
import settings from '../settings';
import UserModel from '../model/user';


export default Backbone.Collection.extend({

    url: settings.apiPath + 'user',

    model: UserModel,

    comparator: 'displayName',
});
