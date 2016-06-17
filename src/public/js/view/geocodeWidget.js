
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import leafletControlGeocoder from 'leaflet-control-geocoder';
import template from '../../templates/geocodeWidget.ejs';
import templateResultItem from '../../templates/geocodeResultItem.ejs';
import CONST from '../const';


export default Marionette.LayoutView.extend({
    template: template,
    templateResultItem: templateResultItem,

    behaviors: {
        'l20n': {},
        'widget': {},
    },

    ui: {
        'widget': '#geocode_widget',
        'query': 'input',
        'resultList': '.results',
    },

    events: {
        'keyup @ui.query': 'onKeyUpQuery',
        'keydown @ui.query': 'onKeyDownQuery',
    },

    initialize: function () {
        this._radio = Wreqr.radio.channel('global');

        switch ( this.model.get('geocoder') ) {
            case CONST.geocodeType.nominatim:
                this._geocoder = leafletControlGeocoder.nominatim();
                break;
            default:
                this._geocoder = leafletControlGeocoder.photon();
        }

        this.on('open', this.onOpen);
    },

    open: function () {
        this.triggerMethod('open');
    },

    close: function () {
        this.triggerMethod('close');
    },

    toggle: function () {
        this.triggerMethod('toggle');
    },

    onAfterOpen: function () {
        this._radio.vent.trigger('column:closeAll');

        this.ui.widget.one('transitionend', () => {
            this.ui.query.focus();
        });
    },

    onKeyUpQuery: function (e) {
        if ( this._queryInterval ) {
            clearInterval(this._queryInterval);
        }

        var query = this.ui.query.val();

        if ( this._lastQuery && this._lastQuery === query ) {
            return false;
        }

        this._queryInterval = setTimeout(() => {
            this.geocode( query );
        }, 350);
    },

    onKeyDownQuery: function (e) {
        if ( [9, 13, 38, 40].indexOf(e.keyCode) > -1 ) {
            e.preventDefault();
        }

        switch ( e.keyCode ) {
            case 40: // Down arrow
            case 9: // Tab

                this.activeNextResult();
                break;

            case 38: // Up arrow

                this.activePreviousResult();
                break;

            case 13: // Enter

                this.visitResult();
                break;
        }
    },

    geocode: function (query) {
        var elements = [];

        this._lastQuery = query;

        if ( !query ) {
            this.ui.resultList.empty();

            return;
        }

        this._geocoder.geocode(query, (results) => {
            let i = 0;

            for (let result of results) {
                elements.push(
                    $( this.templateResultItem({
                        'name': this.buildGeocodeResultName(result),
                    }))
                    .on('click', this.onGeocodeResultClick.bind(this))
                );

                i++;

                if (i === 5) {
                    break;
                }
            }

            this.ui.resultList.html( elements );
        });

    },

    onGeocodeResultClick: function () {
        this._radio.commands.execute('map:fitBounds', result.bbox);

        this.close();
    },

    buildGeocodeResultName: function (result) {
        switch ( this.model.get('geocoder') ) {
            case CONST.geocodeType.nominatim:
                return result.name;

            case CONST.geocodeType.photon:
                let infos = [ result.properties.name ];

                if (result.properties.country) {
                    infos.push( result.properties.country );
                }

                if (result.properties.state) {
                    infos.push( result.properties.state );
                }

                return infos.join(', ');

            default:
                return result.name;
        }
    },

    activeNextResult: function () {
        var current = this.ui.resultList.find('.active');

        if ( !current.length ) {
            this.ui.resultList
            .children()
            .first()
            .addClass('active');
        }
        else {
            current
            .removeClass('active')
            .next()
            .addClass('active');
        }
    },

    activePreviousResult: function () {
        var current = this.ui.resultList.find('.active');

        if ( !current.length ) {
            this.ui.resultList
            .children()
            .last()
            .addClass('active');
        }
        else {
            current
            .removeClass('active')
            .prev()
            .addClass('active');
        }
    },

    visitResult: function () {
        var current = this.ui.resultList.find('.active');

        if ( !current.length ) {
            this.ui.resultList
            .children()
            .first()
            .addClass('active')
            .click();
        }
        else {
            current.click();
        }
    },
});
