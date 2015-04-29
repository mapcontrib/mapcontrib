this["JST"] = this["JST"] || {};

this["JST"]["main.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div id="main_map"></div>\n\n<section id="control_toolbar">\n\t<button type="button" class="btn zoom_in_btn" title="Vue rapprochée" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-plus"></i>\n\t</button>\n\n\t<button type="button" class="btn zoom_out_btn append-xs-tiny" title="Vue éloignée" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-minus"></i>\n\t</button>\n\n\t<button type="button" class="btn locate_btn" title="Afficher mon emplacement" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-location-arrow"></i>\n\t</button>\n</section>\n\n<section id="edit_toolbar">\n\t<button type="button" class="btn user_btn" title="Se connecter" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-user"></i>\n\t</button>\n\n\t<button type="button" class="btn edit_btn" title="Modifier la carte" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-pencil"></i>\n\t</button>\n</section>\n\n<section id="edit_column" class="open">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2>Modifier la carte</h2>\n\t</header>\n\n\t<section class="content">\n\n\t</section>\n</section>\n\n\n<section id="help_toolbar">\n\t<button type="button" class="btn help_btn" title="Aide" data-toggle="tooltip" data-placement="top">\n\t\t<i class="fa fa-fw fa-question-circle"></i>\n\t</button>\n</section>\n';

}
return __p
};