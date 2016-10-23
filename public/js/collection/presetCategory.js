
import Backbone from 'backbone';
import PresetCategoryModel from '../model/presetCategory';


export default Backbone.Collection.extend({
    model: PresetCategoryModel,

    comparator: 'name',
});
