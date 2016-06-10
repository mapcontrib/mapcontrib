
import _ from 'underscore';
import Backbone from 'backbone';
import BackboneRelational from 'backbone-relational';
import settings from '../settings';


export default Backbone.RelationalModel.extend({
    idAttribute: '_id',

    urlRoot: settings.apiPath + 'preset',

    defaults: {
        'themeId': undefined,
        'name': undefined,
        'description': undefined,
        'order': undefined,
        'tags': [], // [{'key': '', 'value': '', 'readOnly': true}, [...]]
    },
});
