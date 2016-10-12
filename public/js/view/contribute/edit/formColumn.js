
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import L from 'leaflet';
import ContribNodeTagsListView from 'ui/form/contribNodeTags';
import ContributionErrorNotificationView from 'view/contributionErrorNotification';
import ContributeAddPositionContextual from 'view/contribute/edit/positionContextual';
import template from 'templates/contribute/edit/formColumn.ejs';
import osmAuth from 'osm-auth';
import OsmEditHelper from 'helper/osmEdit.js';
import NonOsmDataModel from 'model/nonOsmData';
import OsmCacheModel from 'model/osmCache';
import TagModel from 'model/tag';
import CONST from 'const';
import InfoDisplay from 'core/infoDisplay';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: false,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    regions: {
        tagList: '.rg_tag_list',
    },

    ui: {
        column: '.column',
        closeBtn: '.close_btn',
        moveSection: '.move_section',
        moveBtn: '.move_btn',
        bottom: '.bottom',
        form: 'form',
        content: '.content',
        addBtn: '.add_btn',
        footerButtons: '.sticky-footer button',
    },

    events: {
        'click @ui.addBtn': 'onClickAddBtn',
        'click @ui.moveBtn': 'onClickMove',
        'click @ui.closeBtn': 'onClickClose',
        submit: 'onSubmit',
    },

    templateHelpers() {
        return {
            fragment: this._theme.get('fragment'),
            apiPath: `${CONST.apiPath}/file/nonOsmData`,
        };
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._map = this._radio.reqres.request('map');
        this._config = this.options.config;
        this._theme = this.options.theme;
        this._iDPresetsHelper = this.options.iDPresetsHelper;
        this._nonOsmData = this.options.nonOsmData;
        this._osmCache = this.options.osmCache;
        this._user = this.options.user;
        this._layer = this.options.layer;
        this._layer = this.options.layer;
        this._layerModel = this.options.layerModel;

        this._contributionSent = false;

        this._osmEdit = new OsmEditHelper(
            osmAuth({
                url: this._config.oauthEndPoint,
                oauth_consumer_key: this._config.oauthConsumerKey,
                oauth_secret: this._config.oauthSecret,
                oauth_token: this._user.get('token'),
                oauth_token_secret: this._user.get('tokenSecret'),
            })
        );

        this._osmEdit.setType( this.options.osmType );
        this._osmEdit.setId( this.options.osmId );
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    onBeforeClose() {
        if ( this._osmEdit.getType() === 'node' && this._oldLatLng ) {
            if (!this._contributionSent) {
                this._layer.setLatLng( this._oldLatLng );
            }
        }
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onRender() {
        const promises = [ this._osmEdit.fetch() ];

        this._nonOsmDataModel = this._nonOsmData.findWhere({
            themeFragment: this.options.theme.get('fragment'),
            osmId: this.options.osmId,
            osmType: this.options.osmType,
        });

        if ( !this._nonOsmDataModel ) {
            this._nonOsmDataModel = new NonOsmDataModel({
                themeFragment: this.options.theme.get('fragment'),
                osmId: this.options.osmId,
                osmType: this.options.osmType,
            });
            this._nonOsmData.add( this._nonOsmDataModel );
        }
        else {
            promises.push(
                new Promise((resolve, reject) => {
                    this._nonOsmDataModel.fetch({
                        success: model => resolve(model),
                        error: (model, response) => reject(response),
                    });
                })
            );
        }

        this._osmCacheModel = this._osmCache.findWhere({
            themeFragment: this.options.theme.get('fragment'),
            osmId: this.options.osmId,
            osmType: this.options.osmType,
        });

        if ( !this._osmCacheModel ) {
            this._osmCacheModel = new OsmCacheModel({
                themeFragment: this.options.theme.get('fragment'),
                osmId: this.options.osmId,
                osmType: this.options.osmType,
            });
            this._osmCache.add( this._osmCacheModel );
        }
        else {
            promises.push(
                new Promise((resolve, reject) => {
                    this._osmCacheModel.fetch({
                        success: model => resolve(model),
                        error: (model, response) => reject(response),
                    });
                })
            );
        }

        Promise.all(promises)
        .then((results) => {
            const osmEdit = results[0];

            if ( this._osmEdit.getType() === 'node' ) {
                this._oldLatLng = L.latLng(
                    this._osmEdit.getLatitude(),
                    this._osmEdit.getLongitude(),
                );
                this.ui.moveSection.removeClass('hide');
            }

            const version = osmEdit.getVersion();

            if ( this._osmCacheModel.get('osmVersion') > version ) {
                osmEdit.setElement(
                    this._osmCacheModel.get('osmElement')
                );
            }

            this.renderTags( osmEdit.getTags() );
        })
        .catch((err) => {
            console.error('FIXME', err);
        });
    },

    renderTags(tags) {
        this._tagList = new ContribNodeTagsListView({
            iDPresetsHelper: this.options.iDPresetsHelper,
            customTags: this.options.theme.get('tags'),
        });

        const popupContent = this._layerModel.get('popupContent');
        const popupTags = InfoDisplay.findTagsFromContent(popupContent);


        for (const tag of this._nonOsmDataModel.get('tags')) {
            this._tagList.addTag({
                key: tag.key,
                value: tag.value,
                type: tag.type,
                keyReadOnly: true,
                valueReadOnly: false,
                nonOsmData: true,
            });
        }

        switch (typeof this.options.preset) {
            case 'object':
                for (const tag of this.options.preset.get('tags')) {
                    this._tagList.addTag(tag);
                }
                break;
            case 'string':
                const preset = this._iDPresetsHelper.getPreset(this.options.preset);

                for (const fieldName of preset.fields) {
                    if ({}.hasOwnProperty.bind(preset.fields, fieldName)) {
                        const field = this._iDPresetsHelper.getField(fieldName);

                        // FIXME - Have to take care of that case
                        if (!field.key) {
                            continue;
                        }

                        this._tagList.addTag(
                            new TagModel({
                                key: field.key,
                                type: field.type,
                            })
                        );
                    }
                }
                for (const tagName in preset.tags) {
                    if ({}.hasOwnProperty.bind(preset.tags, tagName)) {
                        let value = preset.tags[tagName];

                        if (value === '*') {
                            value = '';
                        }

                        this._tagList.addTag(
                            new TagModel({
                                key: tagName,
                                value,
                            })
                        );
                    }
                }
                break;
            default:
        }

        if ( popupTags) {
            for (const popupTag of popupTags) {
                if (popupTag === 'id' || popupTag === 'type') {
                    continue;
                }

                this._tagList.addTag({
                    key: popupTag,
                });
            }
        }

        for (const key in tags) {
            if ({}.hasOwnProperty.call(tags, key)) {
                this._tagList.addTag({
                    key,
                    value: tags[key],
                    type: CONST.tagType.text,
                    keyReadOnly: false,
                    valueReadOnly: false,
                    nonOsmData: false,
                });
            }
        }

        this.getRegion('tagList').show( this._tagList );
    },

    onClickAddBtn() {
        this._tagList.addTag();
        this._scrollToBottom();
    },

    _scrollToBottom() {
        window.requestAnimationFrame(() => {
            this.ui.bottom[0].scrollIntoView({ behavior: 'smooth' });
        });
    },

    onSubmit(e) {
        e.preventDefault();

        this.ui.footerButtons.prop('disabled', true);

        this._tagList.hideErrorFeedbacks();

        const hasFilesToUpload = this._tagList.hasFileToUpload();

        if ( hasFilesToUpload ) {
            this.ui.form.ajaxSubmit({
                error: (xhr) => {
                    switch (xhr.status) {
                        case 413:
                            this._tagList.showErrorFeedback(xhr.responseJSON);
                            break;
                        default:
                            this._tagList.showErrorFeedback(xhr.responseJSON);
                    }
                },
                success: (response) => {
                    this._tagList.setFilesPathFromApiResponse(response);
                    this.saveLayer();
                },
            });
        }
        else {
            this.saveLayer();
        }
    },

    saveLayer() {
        const createdBy = CONST.osm.changesetCreatedBy
        .replace('{version}', MAPCONTRIB.version);
        const tags = this._tagList.getTags();
        const osmTags = {};
        const nonOsmTags = [];

        for (const tag of tags) {
            if (tag.nonOsmData) {
                nonOsmTags.push({
                    key: tag.key,
                    value: tag.value,
                    type: tag.type,
                });
            }
            else {
                if (!tag.key || !tag.value) {
                    continue;
                }

                osmTags[tag.key] = tag.value;
            }
        }

        this._nonOsmDataModel.updateModificationDate();
        this._nonOsmDataModel.set('tags', nonOsmTags);
        this._nonOsmDataModel.set('userId', this._user.get('osmId'));
        this._nonOsmDataModel.save();

        this._osmEdit.setChangesetCreatedBy(createdBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setTimestamp();
        this._osmEdit.setTags( osmTags );
        this._osmEdit.setUid(this._user.get('osmId'));
        this._osmEdit.setDisplayName(this._user.get('displayName'));

        this.sendContributionToOSM();
    },

    sendContributionToOSM() {
        this._osmEdit.send()
        .then((version) => {
            this.ui.footerButtons.prop('disabled', false);

            this._contributionSent = true;

            this._osmEdit.setVersion(version);

            const overPassElement = this._osmEdit.getOverPassElement();

            this._radio.commands.execute(
                'saveOverPassData',
                overPassElement,
                this._layerModel
            );

            this._radio.commands.execute(
                'map:updatePoiPopup',
                this._layerModel,
                overPassElement
            );

            this._osmCacheModel.updateModificationDate();
            this._osmCacheModel.set('userId', this._user.get('osmId'));
            this._osmCacheModel.set('osmVersion', version);
            this._osmCacheModel.set('overPassElement', overPassElement);
            this._osmCacheModel.set('osmElement', this._osmEdit.getElement());
            this._osmCacheModel.save();

            this.triggerMethod('closeAndDestroy');
        })
        .catch((err) => {
            console.error(err);

            this.ui.footerButtons.prop('disabled', false);

            new ContributionErrorNotificationView({
                retryCallback: this.sendContributionToOSM.bind(this),
            }).open();
        });
    },

    setNewPosition(lat, lng) {
        this._osmEdit.setLatitude(lat);
        this._osmEdit.setLongitude(lng);

        this._layer.setLatLng(
            L.latLng([ lat, lng ])
        );
    },

    onClickMove(e) {
        e.preventDefault();

        new ContributeAddPositionContextual({
            layer: this.options.layer,
            formColumnView: this,
        }).open();

        this.close(true);
    },

    onClickClose(e) {
        e.stopPropagation();
        this.triggerMethod('closeAndDestroy');
    },
});
