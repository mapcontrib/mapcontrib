
import _ from 'underscore';
import Backbone from 'backbone';
import BackboneRelational from 'backbone-relational';
import CONST from '../const';


export default Backbone.RelationalModel.extend({
    defaults: {
        'uniqid': undefined,
        'name': undefined,
        'description': undefined,
        'order': undefined,
        'tags': [], // [{'key': '', 'value': '', 'readOnly': true}, [...]]
    },

    initialize: function () {
        if (!this.get('uniqid')) {
            let uniqid = this.cid +'_'+ new Date().getTime();
            this.set('uniqid', uniqid);
        }
    },
});
