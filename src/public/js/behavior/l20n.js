
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import L20n from 'l20n';


export default Marionette.Behavior.extend({
    onRender: function () {
        document.l10n.localizeNode( this.el );
    },
});
