
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import leafletControlGeocoder from 'leaflet-control-geocoder/src';
import template from 'templates/geocodeWidget.ejs';
import templateResultItem from 'templates/geocodeResultItem.ejs';
import CONST from 'const';


export default Marionette.LayoutView.extend({
    template,
    templateResultItem,

    behaviors: {
        l20n: {},
        widget: {},
    },

    ui: {
        widget: '#geocode_widget',
        query: 'input',
        resultList: '.results',
    },

    events: {
        'keyup @ui.query': 'onKeyUpQuery',
        'keydown @ui.query': 'onKeyDownQuery',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this.on('open', this.onOpen);
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    toggle() {
        this.triggerMethod('toggle');
    },

    onAfterOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);

        this.ui.widget.one('transitionend', () => {
            this.ui.query.focus();
        });
    },

    onKeyUpQuery() {
        if ( this._queryInterval ) {
            clearInterval(this._queryInterval);
        }

        const query = this.ui.query.val();

        if ( this._lastQuery && this._lastQuery === query ) {
            return false;
        }

        this._queryInterval = setTimeout(() => {
            this.geocode( query );
        }, 350);

        return true;
    },

    onKeyDownQuery(e) {
        if ( [9, 13, 38, 40].indexOf(e.keyCode) > -1 ) {
            e.preventDefault();
        }

        switch ( e.keyCode ) {
            case 27:
                this.close();
                break;

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
            default:
        }
    },

    geocode(query) {
        const elements = [];

        this._lastQuery = query;
        this._lastQueryStartTime = new Date().getTime();

        if ( !query ) {
            this.ui.resultList.empty();

            return;
        }

        this.options.icon.addClass('hide');
        this.options.spinner.removeClass('hide');

        const geocoder = this._buildGeocoder();
        geocoder.geocode(
            query,
            this._onGeocodeComplete.bind(this, this._lastQueryStartTime, elements)
        );
    },

    _onGeocodeComplete(startTime, elements, results) {
        if (startTime !== this._lastQueryStartTime) {
            return;
        }

        let i = 0;

        for (const result of results) {
            elements.push(
                $( this.templateResultItem(
                    this._buildGeocodeResultName(result)
                ))
                .on('click', this.onGeocodeResultClick.bind(this, result))
            );

            i += 1;

            if (i === 5) {
                break;
            }
        }

        this.ui.resultList.html( elements );

        this.options.spinner.addClass('hide');
        this.options.icon.removeClass('hide');
    },

    onGeocodeResultClick(result) {
        this._radio.commands.execute('map:fitBounds', result.bbox);

        this.close();
    },

    _buildGeocodeResultName(result) {
        const details = [];

        switch ( this.model.get('geocoder') ) {
            case CONST.geocoder.nominatim:
                const splittedResult = result.name.split(', ');

                return {
                    name: splittedResult.shift(),
                    detail: splittedResult.join(', '),
                };

            case CONST.geocoder.photon:
                if (result.properties.city) {
                    details.push( result.properties.city );
                }

                if (result.properties.country) {
                    details.push( result.properties.country );
                }

                if (result.properties.state) {
                    details.push( result.properties.state );
                }

                return {
                    name: result.name,
                    detail: details.join(', '),
                };

            default:
                return false;
        }
    },

    activeNextResult() {
        const current = this.ui.resultList.find('.active');

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

    activePreviousResult() {
        const current = this.ui.resultList.find('.active');

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

    visitResult() {
        const current = this.ui.resultList.find('.active');

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

    _buildGeocoder() {
        const lang = document.l10n.supportedLocales[0];

        switch ( this.model.get('geocoder') ) {
            case CONST.geocoder.nominatim:
                const bounds = this._radio.reqres.request('map:currentBounds');
                const left = bounds._southWest.lng;
                const top = bounds._northEast.lat;
                const right = bounds._northEast.lng;
                const bottom = bounds._southWest.lat;

                return leafletControlGeocoder.nominatim({
                    geocodingQueryParams: {
                        viewbox: `${left},${top},${right},${bottom}`,
                        'accept-language': lang,
                    },
                });
            default:
                const { lat, lng } = this._radio.reqres.request('map:currentCenter');
                return leafletControlGeocoder.photon({
                    geocodingQueryParams: {
                        lat,
                        lon: lng,
                        lang,
                    },
                });
        }
    },
});
