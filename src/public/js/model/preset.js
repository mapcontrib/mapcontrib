
import _ from 'underscore';
import Backbone from 'backbone';
import BackboneRelational from 'backbone-relational';
import CONST from '../const';


export default Backbone.RelationalModel.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'preset',

    defaults: {
        'themeId': undefined,
        'name': undefined,
        'description': undefined,
        'order': undefined,
        'tags': [], // [{'key': '', 'value': '', 'readOnly': true}, [...]]
    },
});
