
import _ from 'underscore';
import Backbone from 'backbone';
import CONST from '../const';


export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'user',

    defaults: {
        'osmId': undefined,
        'displayName': undefined,
        'avatar': undefined,
        'token': undefined,
        'tokenSecret': undefined,
    }
});
