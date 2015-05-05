this["JST"] = this["JST"] || {};

this["JST"]["contribColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="contrib_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2>Ajouter un marqueur</h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["editPoiColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_poi_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2>Centres d\'intérêt</h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["editSettingColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_setting_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2>Configuration</h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["editTileColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_tile_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2>Fonds de carte</h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["linkColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="link_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2>Partage</h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12 append-xs-tiny">\n\t\t\t\t<p>\n\t\t\t\t\tCe profil est accessible par tout le monde.\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<p>\n\t\t\t\t\tCommuniquez le lien ci-dessous&nbsp;:\n\t\t\t\t</p>\n\t\t\t\t<form>\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<input type="text" class="form-control" readonly="readonly">\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<p>\n\t\t\t\t\tOu intégrez le code suivant à votre site internet&nbsp;:\n\t\t\t\t</p>\n\t\t\t\t<form>\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<textarea class="form-control" readonly="readonly"></textarea>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["loginModal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="login_modal" class="pop_modal">\n\t<div class="pop">\n\t\t<div class="container-fluid content">\n\t\t\t<div class="row">\n\t\t\t\t<div class="col-xs-12">\n\t\t\t\t\t<img src="img/osm_128.png" alt="OpenStreetMap" width="128" height="128" class="img-responsive center-block" />\n\t\t\t\t\t<p class="text-center">\n\t\t\t\t\t\tPour plus de simplicité, OpenMapper a seulement besoin<br>\n\t\t\t\t\t\tde se connecter à votre compte OpenStreetMap.\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="row">\n\t\t\t\t<div class="col-xs-12 prepend-xs-1">\n\t\t\t\t\t<button type="button" class="btn btn-default close_btn">Fermer</button>\n\t\t\t\t\t<a href="/auth/openstreetmap" class="btn btn-primary pull-right hidden-xs">Se connecter ou créer un compte</a>\n\t\t\t\t\t<a href="/auth/openstreetmap" class="btn btn-primary pull-right visible-xs">Se connecter</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["main.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<header id="title">\n\t<h1>Nom du profil</h1>\n</header>\n\n\n<div id="main_map"></div>\n\n\n<section id="control_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn zoom_in_btn" title="Vue rapprochée" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-plus"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn zoom_out_btn append-xs-tiny" title="Vue éloignée" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-minus"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn locate_btn append-xs-tiny" title="Afficher mon emplacement" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-location-arrow"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn poi_btn" title="Centres d\'intérêt" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-map-marker"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn tile_btn" title="Fonds de carte" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-th-large"></i>\n\t</button>\n</section>\n\n\n<section id="help_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn help_btn" title="Aide" data-toggle="tooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-question-circle"></i>\n\t</button>\n</section>\n\n\n<section id="user_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn login_btn" title="Se connecter" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-user"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn user_btn hide" title="Mon compte" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-user"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn link_btn" title="Partager" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-paper-plane"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn contrib_btn" title="Ajouter un point d\'intérêt manquant" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-thumb-tack"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn edit_btn" title="Modifier le profil" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-pencil"></i>\n\t</button>\n</section>\n\n\n<section id="edit_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn setting_btn" title="Configurer le profil" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-cog"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn poi_btn" title="Modifier les centres d\'intérêt" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-map-marker"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn tile_btn" title="Modifier les fonds de carte" data-toggle="tooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-th-large"></i>\n\t</button>\n</section>\n\n\n\n\n<section id="rg_login_modal"></section>\n\n<section id="rg_user_column"></section>\n<section id="rg_link_column"></section>\n<section id="rg_contrib_column"></section>\n<section id="rg_edit_setting_column"></section>\n<section id="rg_edit_poi_column"></section>\n<section id="rg_edit_tile_column"></section>\n\n<section id="rg_tip_of_the_day"></section>\n';

}
return __p
};

this["JST"]["tipOfTheDay.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="tip_of_the_day" class="open">\n\t<div class="container-fluid">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<h3>Le saviez-vous&nbsp;?</h3>\n\t\t\t\t<p>\n\t\t\t\t\tIl est possible d\'utiliser cette carte pour améliorer <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a>&nbsp;!<br>\n\t\t\t\t\tVous pouvez aussi récupérer ce profil et le modifier selon vos besoins.\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="row prepend-xs-tiny append-xs-tiny">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<button type="button"class="btn ok_btn">Je le savais déjà</button>\n\t\t\t\t<button type="button"class="btn close_btn pull-right">Fermer</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["userColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="user_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2>Mon compte</h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<nav>\n\t\t\t\t\t<ul class="nav nav-pills nav-stacked">\n\t\t\t\t\t\t<li role="presentation"><a href="#">Mes profils</a></li>\n\t\t\t\t\t\t<li role="presentation"><a href="#">Préférences</a></li>\n\t\t\t\t\t\t<li role="presentation"><a href="#">Se déconnecter</a></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</nav>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};