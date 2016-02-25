this["JST"] = this["JST"] || {};

this["JST"]["conflictModal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="conflict_modal" class="pop_modal">\n    <div class="pop white">\n        <div class="container-fluid content">\n            <div class="row">\n                <div class="col-xs-12">\n                    <h2 data-l10n-id="conflictModal_title"></h2>\n                    <p data-l10n-id="conflictModal_explanation1"></p>\n                    <p data-l10n-id="conflictModal_explanation2"></p>\n                </div>\n            </div>\n            <div class="row">\n                <div class="col-xs-12 prepend-xs-1">\n                    <button type="button" class="btn btn-primary pull-right close_btn" data-l10n-id="letsGo"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["contribColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="contrib_column" class="column right red">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="contribColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <form>\n                    <div class="rg_tag_list"></div>\n\n                    <div class="sticky-footer">\n                        <button type="button" class="btn btn-default add_btn" data-l10n-id="contribColumn_addTag"></button>\n                        <button type="submit" class="btn btn-primary pull-right save_btn" data-l10n-id="save"></button>\n                    </div>\n                </form>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["contribField.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group append-xs-2">\n    <div class="input-group">\n        <input type="text" class="form-control key" data-l10n-id="contribColumn_key">\n        <div class="input-group-btn">\n            <button type="button" class="btn btn-info info_btn" tabindex="-1"><i class="fa fa-fw fa-info-circle"></i></button>\n        </div>\n    </div>\n    <div class="input-group">\n        <input type="text" class="form-control value" data-l10n-id="contribColumn_value">\n        <div class="input-group-btn">\n            <button type="button" class="btn btn-danger remove_btn" tabindex="-1"><i class="fa fa-fw fa-trash"></i></button>\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["contributionErrorNotification.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="contribution_error_notification" class="notification right red">\n    <header>\n        <button type="button" class="btn btn-link btn-lg close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n    </header>\n\n    <div class="container-fluid">\n        <div class="row">\n            <div class="col-xs-12">\n                <h3 data-l10n-id="contributionErrorNotification_title"></h3>\n                <div class="content">\n                    <p class="append-xs-1" data-l10n-id="contributionErrorNotification_content"></p>\n                    <button type="button" class="btn btn-default close_btn" data-l10n-id="close"></button>\n                    <button type="button" class="btn btn-primary pull-right retry_btn" data-l10n-id="contributionErrorNotification_retry"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["editPoiColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_poi_column" class="column right orange">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="editPoiColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <div class="rg_layer_list"></div>\n\n                <div class="sticky-footer">\n                    <button type="button" class="btn btn-primary btn-block add_btn" data-l10n-id="editPoiColumn_addLayer"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["editPoiDataColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_poi_data_column" class="column right red">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="editPoiDataColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <form>\n                    <div class="fields">\n                        <p data-l10n-id="editPoiDataColumn_emptyState"></p>\n                    </div>\n                    <div class="form-group sticky-footer hide">\n                        <button type="submit" class="btn btn-primary" data-l10n-id="save"></button>\n                        <button type="reset" class="btn btn-default pull-right" data-l10n-id="cancel"></button>\n                    </div>\n                </form>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["editPoiDataField.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group append-xs-2">\n    <label for="editData_' +
__e( tag ) +
'" class="control-label">' +
((__t = ( tag )) == null ? '' : __t) +
'</label>\n    <input type="text" class="form-control" id="editData_' +
__e( tag ) +
'" data-tag="' +
__e( tag ) +
'" value="' +
__e( value ) +
'">\n    <div class="merge_feedback hide">\n        <div class="remote_value">' +
((__t = ( remoteValue )) == null ? '' : __t) +
'</div>\n        <div class="btn-group btn-group-justified" role="group">\n            <div class="btn-group" role="group">\n                <button type="button" class="btn btn-success take_btn"><i class="fa fa-check"></i> <span data-l10n-id="editPoiDataColumn_take"></span></button>\n            </div>\n            <div class="btn-group" role="group">\n                <button type="button" class="btn btn-danger reject_btn"><i class="fa fa-trash"></i> <span data-l10n-id="editPoiDataColumn_reject"></span></button>\n            </div>\n        </div>\n    </div>\n    <span class="fa fa-exclamation-triangle form-control-feedback"></span>\n</div>\n';

}
return __p
};

this["JST"]["editPoiLayerColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_poi_layer_column" class="column right orange">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="editPoiLayerColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <form>\n                    <div class="form-group append-xs-2">\n                        <label for="layer_name" class="control-label" data-l10n-id="editPoiLayerColumn_layerName"></label>\n                        <input type="text" spellcheck="true" class="form-control" id="layer_name" value="' +
__e( name ) +
'">\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label for="layer_description" class="control-label" data-l10n-id="editPoiLayerColumn_layerDescription"></label>\n                        <textarea spellcheck="true" class="form-control" id="layer_description" rows="2">' +
__e( description ) +
'</textarea>\n                        <div class="help-block" data-l10n-id="markdownAvailable"><a target="_blank" href="https://en.wikipedia.org/wiki/Markdown"></a></div>\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label class="control-label" data-l10n-id="editPoiLayerColumn_marker"></label>\n                        <div class="marker-form-widget">\n                            <div class="marker-wrapper">\n                                ' +
((__t = ( marker )) == null ? '' : __t) +
'\n                            </div>\n                            <button type="button" class="btn btn-default edit_marker_btn" data-l10n-id="customize"></button>\n                        </div>\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label class="control-label" data-l10n-id="editPoiLayerColumn_visibilityAndEdition"></label>\n                        <div class="checkbox">\n                            <input type="checkbox" id="layer_visible" value="1" checked>\n                            <label for="layer_visible" data-l10n-id="editPoiLayerColumn_visible"></label>\n                        </div>\n                        <div class="checkbox">\n                            <input type="checkbox" id="layer_data_editable" value="1" checked>\n                            <label for="layer_data_editable" data-l10n-id="editPoiLayerColumn_dataEditable"></label>\n                        </div>\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label for="layer_popup_content" class="control-label" data-l10n-id="editPoiLayerColumn_layerPopupContent"></label>\n                        <textarea rows="3" class="form-control font-monospace" id="layer_popup_content">' +
__e( popupContent ) +
'</textarea>\n                        <div class="help-block" data-l10n-id="markdownAvailable"><a target="_blank" href="https://en.wikipedia.org/wiki/Markdown"></a></div>\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label for="layer_min_zoom" class="control-label" data-l10n-id="editPoiLayerColumn_layerZoomLevel"></label>\n                        <input type="number" id="layer_min_zoom" class="form-control" min="0" value="' +
__e( minZoom ) +
'">\n                        <div class="help-block current_map_zoom"></div>\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label for="layer_overpass_request" class="control-label" data-l10n-id="editPoiLayerColumn_layerOverpassRequest"></label>\n                        <textarea rows="7" spellcheck="false" class="form-control font-monospace" id="layer_overpass_request">' +
__e( overpassRequest ) +
'</textarea>\n                    </div>\n\n                    <div class="form-group sticky-footer">\n                        <button type="submit" class="btn btn-primary" data-l10n-id="save"></button>\n                        <button type="reset" class="btn btn-default pull-right" data-l10n-id="cancel"></button>\n                    </div>\n                </form>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["editPoiLayerListEmpty.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p class="text-center"><em data-l10n-id="editPoiColumn_clickButton"></em></p>\n';

}
return __p
};

this["JST"]["editPoiLayerListItem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="reorder_icon"><i class="fa fa-bars fa-fw"></i></div>\n' +
((__t = ( name )) == null ? '' : __t) +
'\n<button type="button" class="btn remove_btn"><i class="fa fa-trash"></i></button>\n' +
((__t = ( marker )) == null ? '' : __t) +
'\n';

}
return __p
};

this["JST"]["editPoiMarkerModal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_poi_marker_modal" class="pop_modal">\n    <div class="pop white no_padding">\n        <div class="container-fluid content">\n            <div class="row">\n                <div class="col-sm-12">\n\n                    <form>\n\n                        <ul class="nav nav-tabs" role="tablist">\n                            <li role="presentation" class="active"><a href="#marker_color_and_shape" aria-controls="marker_color_and_shape" role="tab" data-toggle="tab" data-l10n-id="editPoiMarkerModal_colorAndShape"></a></li>\n                            <li role="presentation"><a href="#marker_icon" aria-controls="marker_icon" role="tab" data-toggle="tab" data-l10n-id="editPoiMarkerModal_icon"></a></li>\n                        </ul>\n\n                        <div class="tab-content">\n                            <div role="tabpanel" class="tab-pane fade in active prepend-xs-2 append-xs-2" id="marker_color_and_shape">\n\n                                <div class="form-group">\n                                    <label class="control-label" data-l10n-id="editPoiMarkerModal_color"></label>\n                                    <div class="color-buttons">\n                                        <button type="button" class="btn btn-xs btn-marker-color green" data-color="green"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color blue" data-color="blue"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color purple" data-color="purple"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color red" data-color="red"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color orange" data-color="orange"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color yellow" data-color="yellow"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color brown" data-color="brown"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color white" data-color="white"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color gray" data-color="gray"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color dark-gray" data-color="dark-gray"><div><i class="fa fa-fw"></i></div></button>\n                                        <button type="button" class="btn btn-xs btn-marker-color black" data-color="black"><div><i class="fa fa-fw"></i></div></button>\n                                    </div>\n                                </div>\n\n                                <div class="form-group">\n                                    <label class="control-label" data-l10n-id="editPoiMarkerModal_shape"></label>\n                                    <div class="shape-buttons">\n                                        <button type="button" class="btn btn-marker-shape marker1" data-shape="marker1">\n                                            <img src="img/markers/1_optimized.svg" alt="" />\n                                        </button>\n                                        <button type="button" class="btn btn-marker-shape marker2" data-shape="marker2">\n                                            <img src="img/markers/2_optimized.svg" alt="" />\n                                        </button>\n                                        <button type="button" class="btn btn-marker-shape marker3" data-shape="marker3">\n                                            <img src="img/markers/3_optimized.svg" alt="" />\n                                        </button>\n                                    </div>\n                                </div>\n                            </div>\n                            <div role="tabpanel" class="tab-pane fade prepend-xs-1 append-xs-2" id="marker_icon">\n\n                                <div class="row">\n                                    <div class="col-sm-8 col-sm-offset-2">\n                                        <div class="btn-group btn-group-justified append-xs-2" data-toggle="buttons">\n                                            <label class="btn btn-default" id="iconTypeLibraryTab">\n                                                <input type="radio" name="marker_icon_type" class="marker_icon_type_tab" autocomplete="off" checked>\n                                                <span data-l10n-id="editPoiMarkerModal_library"></span>\n                                            </label>\n                                            <label class="btn btn-default" id="iconTypeExternalTab">\n                                                <input type="radio" name="marker_icon_type" class="marker_icon_type_tab" autocomplete="off">\n                                                <span data-l10n-id="editPoiMarkerModal_external"></span>\n                                            </label>\n                                        </div>\n                                    </div>\n                                </div>\n\n                                <div class="form-group form-library">\n                                    <p data-l10n-id="editPoiMarkerModal_iconDescriptionLibrary1"></p>\n                                    <p data-l10n-id="editPoiMarkerModal_iconDescriptionLibrary2"><a href="http://fortawesome.github.io/Font-Awesome/icons" target="_blank"></a></p>\n                                    <label for="marker_icon_name" class="control-label prepend-xs-1" data-l10n-id="editPoiMarkerModal_iconName"></label>\n                                    <div class="input-group">\n                                        <span class="input-group-addon">fa-</span>\n                                        <input type="text" class="form-control" id="markerIconName" placeholder="home" value="' +
__e( markerIcon ) +
'">\n                                        <i class="fa fa-home icon-preview"></i>\n                                    </div>\n                                </div>\n\n                                <div class="form-group form-external hide">\n                                    <p data-l10n-id="editPoiMarkerModal_iconDescriptionExternal1"></p>\n                                    <p data-l10n-id="editPoiMarkerModal_iconDescriptionExternal2"></p>\n                                    <label for="marker_icon_url" class="control-label prepend-xs-1" data-l10n-id="editPoiMarkerModal_iconUrl"></label>\n                                    <input type="text" class="form-control" id="markerIconUrl" placeholder="http://..." value="' +
__e( markerIconUrl ) +
'">\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class="form-group">\n                            <button type="reset" class="btn btn-default close_btn" data-l10n-id="cancel"></button>\n                            <button type="submit" class="btn btn-primary pull-right" data-l10n-id="close"></button>\n                        </div>\n                    </form>\n\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["editSettingColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_setting_column" class="column right orange">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="editSettingColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <form>\n                    <div class="form-group append-xs-2">\n                        <label for="theme_name" class="control-label" data-l10n-id="editSettingColumn_themeName"></label>\n                        <input type="text" spellcheck="true" class="form-control" id="theme_name" value="' +
__e( name ) +
'">\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label for="theme_description" class="control-label" data-l10n-id="editSettingColumn_themeDescription"></label>\n                        <textarea rows="3" class="form-control" id="theme_description">' +
((__t = ( description )) == null ? '' : __t) +
'</textarea>\n                        <div class="help-block" data-l10n-id="markdownAvailable"><a target="_blank" href="https://en.wikipedia.org/wiki/Markdown"></a></div>\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label class="control-label" data-l10n-id="editSettingColumn_color"></label>\n                        <div class="color-buttons">\n                            <button type="button" class="btn btn-xs btn-color orange" data-color="orange"><i class="fa fa-fw"></i></button>\n                            <button type="button" class="btn btn-xs btn-color red" data-color="red"><i class="fa fa-fw"></i></button>\n                            <button type="button" class="btn btn-xs btn-color purple" data-color="purple"><i class="fa fa-fw"></i></button>\n                            <button type="button" class="btn btn-xs btn-color blue" data-color="blue"><i class="fa fa-fw"></i></button>\n                            <button type="button" class="btn btn-xs btn-color turquoise" data-color="turquoise"><i class="fa fa-fw"></i></button>\n                            <button type="button" class="btn btn-xs btn-color green" data-color="green"><i class="fa fa-fw"></i></button>\n                            <button type="button" class="btn btn-xs btn-color white" data-color="white"><i class="fa fa-fw"></i></button>\n                            <button type="button" class="btn btn-xs btn-color anthracite" data-color="anthracite"><i class="fa fa-fw"></i></button>\n                        </div>\n                    </div>\n\n                    <div class="form-group append-xs-2">\n                        <label class="control-label" data-l10n-id="editSettingColumn_position"></label>\n                        <div class="radio">\n                            <input type="radio" name="theme_position" id="theme_position_keep_old" value="1" checked>\n                            <label for="theme_position_keep_old" data-l10n-id="editSettingColumn_keepOld"></label>\n                        </div>\n                        <div class="radio">\n                            <input type="radio" name="theme_position" id="theme_position_set_new" value="1">\n                            <label for="theme_position_set_new" data-l10n-id="editSettingColumn_setNew"></label>\n                        </div>\n                    </div>\n\n                    <div class="form-group sticky-footer">\n                        <button type="submit" class="btn btn-primary" data-l10n-id="save"></button>\n                        <button type="reset" class="btn btn-default pull-right" data-l10n-id="cancel"></button>\n                    </div>\n                </form>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["editTileColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="edit_tile_column" class="column right orange">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="editTileColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <form>\n                    <div class="tile_list"></div>\n\n                    <div class="sticky-footer">\n                        <button type="submit" class="btn btn-primary" data-l10n-id="save"></button>\n                        <button type="reset" class="btn btn-default pull-right" data-l10n-id="cancel"></button>\n                    </div>\n                </form>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["geocodeResultItem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button type="button" class="list-group-item">' +
((__t = ( name )) == null ? '' : __t) +
'</button>\n';

}
return __p
};

this["JST"]["geocodeWidget.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="geocode_widget">\n    <input type="text" spellcheck="true" data-l10n-id="geocodeWidget_queryInput" class="form-control input-lg">\n    <div class="list-group results"></div>\n</section>\n';

}
return __p
};

this["JST"]["linkColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="link_column" class="column right green">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="linkColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <p data-l10n-id="linkColumn_linkLabel"></p>\n                <form>\n                    <div class="form-group">\n                        <input type="text" class="form-control auto_select" readonly="readonly" value="' +
__e( url ) +
'">\n                    </div>\n                </form>\n            </div>\n        </div>\n        <div class="row">\n            <div class="col-xs-12">\n                <p data-l10n-id="linkColumn_integrateCode"></p>\n                <form class="form-horizontal">\n                    <div class="form-group">\n                        <div class="col-xs-12">\n                            <textarea spellcheck="false" id="iframe_code" class="form-control auto_select" readonly="readonly" rows="4"></textarea>\n                        </div>\n                    </div>\n\n                    <div class="form-group">\n                        <label for="iframe_width" class="col-xs-4 control-label" data-l10n-id="linkColumn_width"></label>\n                        <div class="col-xs-8">\n                            <div class="input-group">\n                                <input type="number" min="0" id="iframe_width" class="form-control" value="' +
__e( iframeWidth ) +
'">\n                                <span class="input-group-addon" id="iframe_width_unit">' +
__e( iframeWidthUnit ) +
'</span>\n                                <span class="input-group-btn">\n                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>\n                                    <ul class="dropdown-menu dropdown-menu-right" id="iframe_width_unit_dropdown">\n                                        <li><a href="#" data-l10n-id="linkColumn_percentage" data-unit="%"></a></li>\n                                        <li><a href="#" data-l10n-id="linkColumn_pixel" data-unit="px"></a></li>\n                                    </ul>\n                                </span>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class="form-group">\n                        <label for="iframe_height" class="col-xs-4 control-label" data-l10n-id="linkColumn_height"></label>\n                        <div class="col-xs-8">\n                            <div class="input-group">\n                                <input type="number" min="0" id="iframe_height" class="form-control" value="' +
__e( iframeHeight ) +
'">\n                                <span class="input-group-addon" id="iframe_height_unit">' +
__e( iframeHeightUnit ) +
'</span>\n                                <span class="input-group-btn">\n                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>\n                                    <ul class="dropdown-menu dropdown-menu-right" id="iframe_height_unit_dropdown">\n                                        <li><a href="#" data-l10n-id="linkColumn_percentage" data-unit="%"></a></li>\n                                        <li><a href="#" data-l10n-id="linkColumn_pixel" data-unit="px"></a></li>\n                                    </ul>\n                                </span>\n                            </div>\n                        </div>\n                    </div>\n\n                </form>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["linkColumnIframe.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<iframe src="' +
__e( url ) +
'" width="' +
__e( iframeWidth ) +
'' +
__e( iframeWidthUnit ) +
'" height="' +
__e( iframeHeight ) +
'' +
__e( iframeHeightUnit ) +
'" frameBorder="0"></iframe><p><a href="' +
__e( url ) +
'">' +
__e( subLinkMessage ) +
'</a></p>\n';

}
return __p
};

this["JST"]["loginModal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="login_modal" class="pop_modal">\n    <div class="pop white">\n        <div class="container-fluid content">\n            <div class="row">\n                <div class="col-xs-12">\n                    <img src="img/osm_128.png" alt="OpenStreetMap" width="128" height="128" class="img-responsive center-block" />\n                    <p class="text-center" data-l10n-id="loginModal_explanation"></p>\n                </div>\n            </div>\n            <div class="row">\n                <div class="col-xs-12 prepend-xs-1">\n                    <button type="button" class="btn btn-default close_btn" data-l10n-id="close"></button>\n                    <a href="/auth?authCallback=' +
__e( authCallback ) +
'" class="btn btn-primary pull-right hidden-xs" data-l10n-id="loginOrSubscribe"></a>\n                    <a href="/auth?authCallback=' +
__e( authCallback ) +
'" class="btn btn-primary pull-right visible-xs" data-l10n-id="login"></a>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["main.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<header id="rg_main_title"></header>\n\n<div id="main_map"></div>\n\n\n<section id="help_toolbar" class="toolbar left open">\n    <button type="button" class="btn toolbar_btn help_btn" data-l10n-id="buttonHelpTooltip" data-placement="right">\n        <i class="icon ion-help-buoy"></i>\n    </button>\n</section>\n\n\n<section id="help" class="fullpage white">\n    <button type="button" class="btn btn-link btn-lg close_btn">\n        <i class="fa fa-close"></i>\n    </button>\n\n\n    <div class="container content">\n        <div class="row">\n            <div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">\n                <h2 class="prepend-xs-2 append-xs-2" data-l10n-id="helpTitle"></h2>\n\n                <p data-l10n-id="helpText1"></p>\n                <p data-l10n-id="helpText2"><a href="https://www.openstreetmap.org"></a></p>\n                <p data-l10n-id="helpText3"><a href="https://www.openstreetmap.org/copyright"></a></p>\n                <p data-l10n-id="helpText4"></p>\n\n                <ul>\n                    <li><a href="http://umap.openstreetmap.fr">uMap</a></li>\n                    <li><a href="http://openbeermap.github.io">OpenBeerMap</a></li>\n                    <li><a href="http://osmose.openstreetmap.fr">Osmose</a></li>\n                    <li><a href="http://wheelmap.org">Wheelmap</a></li>\n                    <li><a href="http://www.osmhydrant.org">OSM Hydrant</a></li>\n                </ul>\n\n                <p class="prepend-xs-2 text-center">\n                    <a href="http://gironde.fr"><img class="append-xs-1" alt="Département de la Gironde" title="Département de la Gironde" src="img/partners/gironde.png"></a>\n                    <a href="http://numetlib.fr"><img class="append-xs-1" alt="Num&amp;Lib" title="Num&amp;Lib" src="img/partners/numlib.png"></a>\n                    <a href="http://coopalpha.coop"><img class="append-xs-1" alt="Coop\'Alpha" title="Coop\'Alpha" src="img/partners/coopalpha.png"></a>\n                </p>\n            </div>\n        </div>\n    </div>\n</section>\n\n\n<section id="control_toolbar" class="toolbar left open">\n    <button type="button" class="btn toolbar_btn zoom_in_btn" data-l10n-id="buttonZoomInTooltip" data-placement="right">\n        <i class="icon ion-plus"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn zoom_out_btn append-xs-tiny" data-l10n-id="buttonZoomOutTooltip" data-placement="right">\n        <i class="icon ion-minus"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn geocode_btn" data-l10n-id="buttonGeocodeTooltip" data-placement="right">\n        <i class="icon ion-search"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn locate_btn append-xs-tiny" data-l10n-id="buttonLocateTooltip" data-placement="right">\n        <i class="icon ion-android-locate"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn locate_wait_btn append-xs-tiny hide" data-l10n-id="buttonLocateWaitTooltip" data-placement="right">\n        <img src="img/locate_wait.gif" width="24" height="24" alt="">\n    </button>\n\n    <button type="button" class="btn toolbar_btn expand_screen_btn append-xs-tiny" data-l10n-id="buttonExpandScreenTooltip" data-placement="right">\n        <i class="icon ion-arrow-expand"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn compress_screen_btn append-xs-tiny hide" data-l10n-id="buttonCompressScreenTooltip" data-placement="right">\n        <i class="icon ion-arrow-shrink"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn poi_btn" data-l10n-id="buttonPoiTooltip" data-placement="right">\n        <i class="icon ion-social-buffer"></i>\n        <img src="img/locate_wait.gif" width="24" height="24" alt="" class="poi_loading hide">\n    </button>\n\n    <button type="button" class="btn toolbar_btn tile_btn" data-l10n-id="buttonTileTooltip" data-placement="right">\n        <i class="icon ion-map"></i>\n    </button>\n</section>\n\n\n<section id="user_toolbar" class="toolbar right open">\n    <button type="button" class="btn toolbar_btn login_btn" data-l10n-id="buttonLoginTooltip" data-placement="left">\n        <i class="icon ion-happy-outline"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn user_btn hide" data-l10n-id="buttonUserTooltip" data-placement="left">\n        <i class="icon ion-happy-outline"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn link_btn" data-l10n-id="buttonLinkTooltip" data-placement="left">\n        <i class="icon ion-android-share-alt"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn contrib_btn hide" data-l10n-id="buttonContribTooltip" data-placement="left">\n        <i class="icon ion-pinpoint"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn edit_btn hide" data-l10n-id="buttonEditTooltip" data-placement="left">\n        <i class="icon ion-wrench"></i>\n    </button>\n</section>\n\n\n<section id="edit_toolbar" class="toolbar right">\n    <button type="button" class="btn toolbar_btn setting_btn" data-l10n-id="buttonEditSettingTooltip" data-placement="left">\n        <i class="icon ion-android-options"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn poi_btn" data-l10n-id="buttonEditPoiTooltip" data-placement="left">\n        <i class="icon ion-social-buffer"></i>\n    </button>\n\n    <button type="button" class="btn toolbar_btn tile_btn" data-l10n-id="buttonEditTileTooltip" data-placement="left">\n        <i class="icon ion-map"></i>\n    </button>\n</section>\n\n\n<section id="notification_container"></section>\n\n\n\n<section id="rg_login_modal"></section>\n<section id="rg_conflict_modal"></section>\n\n<section id="rg_geocode_widget"></section>\n<section id="rg_select_poi_column"></section>\n<section id="rg_select_tile_column"></section>\n<section id="rg_user_column"></section>\n<section id="rg_link_column"></section>\n<section id="rg_contrib_column"></section>\n<section id="rg_edit_setting_column"></section>\n<section id="rg_edit_poi_column"></section>\n<section id="rg_edit_poi_layer_column"></section>\n<section id="rg_edit_poi_marker_modal"></section>\n<section id="rg_edit_tile_column"></section>\n<section id="rg_edit_poi_data_column"></section>\n\n<section id="rg_zoom_notification"></section>\n';

}
return __p
};

this["JST"]["mainTitle.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="title" class="fullpage ' +
__e( color ) +
'">\n    <div class="container">\n        <div class="row">\n            <div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">\n                <h1 class="append-xs-2">\n                ' +
((__t = ( name )) == null ? '' : __t) +
'\n                </h1>\n                <div class="description">' +
((__t = ( description )) == null ? '' : __t) +
'</div>\n            </div>\n        </div>\n    </div>\n    <button type="button" class="btn btn-link description_btn hide" data-l10n-id="buttonDescriptionTooltip" data-placement="left"><i class="fa fa-info-circle fa-lg"></i></button>\n</div>\n';

}
return __p
};

this["JST"]["overpassErrorNotification.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="overpass_error_notification" class="notification right red">\n    <header>\n        <button type="button" class="btn btn-link btn-lg close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n    </header>\n\n    <div class="container-fluid">\n        <div class="row">\n            <div class="col-xs-12">\n                <h3 data-l10n-id="overpassErrorNotification_title"></h3>\n                <p class="content"></p>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["overpassTimeoutNotification.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="overpass_timeout_notification" class="notification right orange">\n    <header>\n        <button type="button" class="btn btn-link btn-lg close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n    </header>\n\n    <div class="container-fluid">\n        <div class="row">\n            <div class="col-xs-12">\n                <h3 data-l10n-id="overpassTimeoutNotification_title"></h3>\n                <p class="content"></p>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["poiLayerList.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="reorder_icon"><i class="fa fa-bars fa-fw"></i></div>\n' +
((__t = ( name )) == null ? '' : __t) +
'\n<button type="button" class="btn remove_btn"><i class="fa fa-trash"></i></button>\n';

}
return __p
};

this["JST"]["selectPoiColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="select_poi_column" class="column left white">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="selectPoiColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <p data-l10n-id="selectPoiColumn_explanation"></p>\n                <p class="currentMapZoom"></p>\n                <div class="rg_layer_list prepend-xs-1"></div>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["selectPoiLayerListItem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="checkbox">\n    <input type="checkbox" id="poi_layer_visibility_' +
__e( _id ) +
'" class="visibility_checkbox" value="1">\n    <label for="poi_layer_visibility_' +
__e( _id ) +
'">\n        ' +
((__t = ( name )) == null ? '' : __t) +
'\n        <div class="help-block">\n            ' +
((__t = ( description )) == null ? '' : __t) +
'\n        </div>\n        <div class="help-block zoom_tip"></div>\n    </label>\n    ' +
((__t = ( marker )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["JST"]["selectTileColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="select_tile_column" class="column left white">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="selectTileColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <div class="tile_list"></div>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["selectTileListItem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="radio append-xs-1">\n    <input type="radio" name="select_tile_radio" id="select_tile_' +
__e( id ) +
'" class="tile_radio" value="' +
__e( id ) +
'"' +
__e( checked ) +
'>\n    <label for="select_tile_' +
__e( id ) +
'">\n        <figure>\n            <img src="' +
__e( thumbnail ) +
'" alt="" />\n        </figure>\n        <figcaption>\n            ' +
((__t = ( name )) == null ? '' : __t) +
'\n        </figcaption>\n    </label>\n</div>\n';

}
return __p
};

this["JST"]["tileListItem.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="checkbox append-xs-1">\n    <input type="checkbox" id="tile_' +
__e( id ) +
'" class="tile_checkbox" value="' +
__e( id ) +
'"' +
__e( checked ) +
'>\n    <label for="tile_' +
__e( id ) +
'">\n        <figure>\n            <img src="' +
__e( thumbnail ) +
'" alt="" />\n        </figure>\n        <figcaption>\n            <div>\n                ' +
((__t = ( name )) == null ? '' : __t) +
'\n            </div>\n            <div class="max_zoom">\n                ' +
((__t = ( maxZoom )) == null ? '' : __t) +
'\n            </div>\n        </figcaption>\n    </label>\n</div>\n';

}
return __p
};

this["JST"]["userColumn.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<section id="user_column" class="column right blue">\n    <header>\n        <button type="button" class="btn btn-link btn-lg pull-right close_btn">\n            <i class="fa fa-close"></i>\n        </button>\n\n        <h2 data-l10n-id="userColumn_title"></h2>\n    </header>\n\n    <div class="container-fluid content">\n        <div class="row">\n            <div class="col-xs-12">\n                <nav>\n                    <ul class="nav nav-pills nav-stacked">\n                        <li role="presentation"><a href="#" data-l10n-id="myThemes"></a></li>\n                        <li role="presentation"><a href="#" data-l10n-id="preferences"></a></li>\n                        <li role="presentation"><a href="#logout" data-l10n-id="logout" class="logout_item"></a></li>\n                    </ul>\n                </nav>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};

this["JST"]["zoomNotification.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<section id="zoom_notification" class="notification white">\n    <div class="container-fluid">\n        <div class="row">\n            <div class="col-xs-12">\n                <i class="fa fa-arrow-left pull-left"></i>\n\n                <p class="content pull-left" data-l10n-id="zoomNotification_content"></p>\n\n                <button type="button" class="btn btn-lg btn-link close_btn">\n                    <i class="fa fa-close"></i>\n                </button>\n            </div>\n        </div>\n    </div>\n</section>\n';

}
return __p
};