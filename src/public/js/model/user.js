
import _ from 'underscore';
import Backbone from 'backbone';
import settings from '../settings';


export default Backbone.Model.extend({
    idAttribute: '_id',

    urlRoot: settings.apiPath + 'user',

    defaults: {
        'osmId': undefined,
        'displayName': undefined,
        'avatar': undefined,
        'token': undefined,
        'tokenSecret': undefined,
    }
});
