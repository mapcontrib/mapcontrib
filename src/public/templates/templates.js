this["JST"] = this["JST"] || {};

this["JST"]["contribColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="contrib_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2 data-l10n-id="columnContribTitle"></h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["editPoiColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_poi_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2 data-l10n-id="columnEditPoiTitle"></h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["editSettingColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_setting_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2 data-l10n-id="columnEditSettingTitle"></h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<form>\n\t\t\t\t\t<div class="form-group append-xs-1">\n\t\t\t\t\t\t<label for="profile_name" class="control-label" data-l10n-id="editSettingColumn_profileName"></label>\n\t\t\t\t\t\t<input type="text" class="form-control" id="profile_name" value="' +
((__t = ( name )) == null ? '' : __t) +
'">\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="form-group append-xs-1">\n\t\t\t\t\t\t<label for="profile_description" class="control-label" data-l10n-id="editSettingColumn_profileDescription"></label>\n\t\t\t\t\t\t<textarea rows="3" class="form-control" id="profile_description">' +
((__t = ( description )) == null ? '' : __t) +
'</textarea>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="form-group append-xs-1">\n\t\t\t\t\t\t<label for="profile_name" class="control-label" data-l10n-id="editSettingColumn_color"></label>\n\t\t\t\t\t\t<div class="colorButtons">\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color orange" data-color="orange"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color red" data-color="red"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color purple" data-color="purple"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color blue" data-color="blue"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color turquoise" data-color="turquoise"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color green" data-color="green"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color white" data-color="white"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t\t<button type="button" class="btn btn-xs btn-color anthracite" data-color="anthracite"><i class="fa fa-fw"></i></button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="form-group append-xs-1">\n\t\t\t\t\t\t<label class="control-label" data-l10n-id="editSettingColumn_position"></label>\n\t\t\t\t\t\t<div class="radio">\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<input type="radio" name="profile_position" id="profile_position_keep_old" value="1" checked>\n\t\t\t\t\t\t\t\t<span data-l10n-id="editSettingColumn_keepOld"></span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="radio">\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<input type="radio" name="profile_position" id="profile_position_set_new" value="1">\n\t\t\t\t\t\t\t\t<span data-l10n-id="editSettingColumn_setNew"></span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<button type="submit" class="btn btn-primary" data-l10n-id="save"></button>\n\t\t\t\t\t\t<button type="reset" class="btn btn-default pull-right" data-l10n-id="cancel"></button>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["editTileColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_tile_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2 data-l10n-id="columnEditTileTitle"></h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["linkColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="link_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2 data-l10n-id="columnLinkTitle"></h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12 append-xs-tiny">\n\t\t\t\t<p data-l10n-id="linkColumn_publicProfile"></p>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<p data-l10n-id="linkColumn_linkLabel"></p>\n\t\t\t\t<form>\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<input type="text" class="form-control" readonly="readonly">\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<p data-l10n-id="linkColumn_integrateCode"></p>\n\t\t\t\t<form>\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<textarea class="form-control" readonly="readonly"></textarea>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["loginModal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="login_modal" class="pop_modal">\n\t<div class="pop">\n\t\t<div class="container-fluid content">\n\t\t\t<div class="row">\n\t\t\t\t<div class="col-xs-12">\n\t\t\t\t\t<img src="img/osm_128.png" alt="OpenStreetMap" width="128" height="128" class="img-responsive center-block" />\n\t\t\t\t\t<p class="text-center" data-l10n-id="loginModal_explanation"></p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="row">\n\t\t\t\t<div class="col-xs-12 prepend-xs-1">\n\t\t\t\t\t<button type="button" class="btn btn-default close_btn" data-l10n-id="close"></button>\n\t\t\t\t\t<a href="/auth/openstreetmap" class="btn btn-primary pull-right hidden-xs" data-l10n-id="loginOrSubscribe"></a>\n\t\t\t\t\t<a href="/auth/openstreetmap" class="btn btn-primary pull-right visible-xs" data-l10n-id="login"></a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["main.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<header id="rg_main_title"></header>\n\n<div id="main_map"></div>\n\n\n<section id="help_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn help_btn" data-l10n-id="buttonHelpTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-question-circle"></i>\n\t</button>\n</section>\n\n\n<section id="help">\n\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t<i class="fa fa-close"></i>\n\t</button>\n\n\n\t<div class="container content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">\n\t\t\t\t<h2 class="prepend-xs-2 append-xs-2" data-l10n-id="helpTitle"></h2>\n\n\t\t\t\t<p data-l10n-id="helpText1"><a href="https://en.wikipedia.org/wiki/Free_software"></a></p>\n\t\t\t\t<p data-l10n-id="helpText2"><a href="https://openstreetmap.org"></a></p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n\n\n<section id="control_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn zoom_in_btn" data-l10n-id="buttonZoomInTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-plus"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn zoom_out_btn append-xs-tiny" data-l10n-id="buttonZoomOutTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-minus"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn locate_btn append-xs-tiny" data-l10n-id="buttonLocateTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-location-arrow"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn locate_wait_btn append-xs-tiny hide" data-l10n-id="buttonLocateWaitTooltip" data-placement="right">\n\t\t<img src="img/locate_wait.gif" width="24" height="24" alt="">\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn expand_screen_btn append-xs-tiny" data-l10n-id="buttonExpandScreenTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-expand"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn compress_screen_btn append-xs-tiny hide" data-l10n-id="buttonCompressScreenTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-compress"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn poi_btn" data-l10n-id="buttonPoiTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-map-marker"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn tile_btn" data-l10n-id="buttonTileTooltip" data-placement="right">\n\t\t<i class="fa fa-fw fa-th-large"></i>\n\t</button>\n</section>\n\n\n<section id="user_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn login_btn" data-l10n-id="buttonLoginTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-user"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn user_btn hide" data-l10n-id="buttonUserTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-user"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn link_btn" data-l10n-id="buttonLinkTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-paper-plane"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn contrib_btn" data-l10n-id="buttonContribTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-thumb-tack"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn edit_btn hide" data-l10n-id="buttonEditTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-pencil"></i>\n\t</button>\n</section>\n\n\n<section id="edit_toolbar" class="toolbar">\n\t<button type="button" class="btn toolbar_btn setting_btn" data-l10n-id="buttonEditSettingTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-cog"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn poi_btn" data-l10n-id="buttonEditPoiTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-map-marker"></i>\n\t</button>\n\n\t<button type="button" class="btn toolbar_btn tile_btn" data-l10n-id="buttonEditTileTooltip" data-placement="left">\n\t\t<i class="fa fa-fw fa-th-large"></i>\n\t</button>\n</section>\n\n\n\n\n<section id="rg_login_modal"></section>\n\n<section id="rg_user_column"></section>\n<section id="rg_link_column"></section>\n<section id="rg_contrib_column"></section>\n<section id="rg_edit_setting_column"></section>\n<section id="rg_edit_poi_column"></section>\n<section id="rg_edit_tile_column"></section>\n\n<section id="rg_tip_of_the_day"></section>\n';

}
return __p
};

this["JST"]["mainTitle.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="title" class="' +
((__t = ( color )) == null ? '' : __t) +
'">\n    <div class="container">\n        <div class="row">\n            <div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">\n                <h1 class="append-xs-2">\n                    ' +
((__t = ( name )) == null ? '' : __t) +
'\n                </h1>\n                <p class="description">' +
((__t = ( description )) == null ? '' : __t) +
'</p>\n            </div>\n        </div>\n    </div>\n    <button type="button" class="btn btn-link description_btn hide" data-l10n-id="buttonDescriptionTooltip" data-placement="left"><i class="fa fa-info-circle fa-lg"></i></button>\n</div>\n';

}
return __p
};

this["JST"]["tipOfTheDay.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="tip_of_the_day" class="open">\n\t<div class="container-fluid">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<h3 data-l10n-id="tipTitle"></h3>\n\t\t\t\t<p class="content"></p>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="row prepend-xs-tiny append-xs-tiny">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<button type="button"class="btn ok_btn" data-l10n-id="alreadyKnown"></button>\n\t\t\t\t<button type="button"class="btn close_btn pull-right" data-l10n-id="close"></button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};

this["JST"]["userColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="user_column" class="column">\n\t<header>\n\t\t<button type="button" class="btn btn-link pull-right close_btn">\n\t\t\t<i class="fa fa-close"></i>\n\t\t</button>\n\n\t\t<h2 data-l10n-id="columnUserTitle"></h2>\n\t</header>\n\n\t<div class="container-fluid content">\n\t\t<div class="row">\n\t\t\t<div class="col-xs-12">\n\t\t\t\t<nav>\n\t\t\t\t\t<ul class="nav nav-pills nav-stacked">\n\t\t\t\t\t\t<li role="presentation"><a href="#" data-l10n-id="myProfiles"></a></li>\n\t\t\t\t\t\t<li role="presentation"><a href="#" data-l10n-id="preferences"></a></li>\n\t\t\t\t\t\t<li role="presentation"><a href="#" data-l10n-id="logout"></a></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</nav>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>\n';

}
return __p
};