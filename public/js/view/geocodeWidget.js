
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import leafletControlGeocoder from 'leaflet-control-geocoder';
import template from 'templates/geocodeWidget.ejs';
import templateResultItem from 'templates/geocodeResultItem.ejs';
import CONST from 'const';


export default Marionette.LayoutView.extend({
    template,
    templateResultItem: templateResultItem,

    behaviors: {
        l20n: {},
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

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this.on('open', this.onOpen);
    },

    open() {
        this._setGeocoder();
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    toggle() {
        this._setGeocoder();
        this.triggerMethod('toggle');
    },

    onAfterOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);

        this.ui.widget.one('transitionend', () => {
            this.ui.query.focus();
        });
    },

    onKeyUpQuery(e) {
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
        }
    },

    geocode(query) {
        const elements = [];

        this._lastQuery = query;

        if ( !query ) {
            this.ui.resultList.empty();

            return;
        }

        this.options.icon.addClass('hide');
        this.options.spinner.removeClass('hide');

        this._geocoder.geocode(query, (results) => {
            let i = 0;

            for (let result of results) {
                elements.push(
                    $( this.templateResultItem(
                        this._buildGeocodeResultName(result)
                    ))
                    .on('click', this.onGeocodeResultClick.bind(this, result))
                );

                i++;

                if (i === 5) {
                    break;
                }
            }

            this.ui.resultList.html( elements );

            this.options.spinner.addClass('hide');
            this.options.icon.removeClass('hide');
        });

    },

    onGeocodeResultClick(result) {
        this._radio.commands.execute('map:fitBounds', result.bbox);

        this.close();
    },

    _buildGeocodeResultName(result) {
        let details = [];

        switch ( this.model.get('geocoder') ) {
            case CONST.geocoder.nominatim:
                let splittedResult = result.name.split(', ');

                return {
                    'name': splittedResult.shift(),
                    'detail': splittedResult.join(', ')
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
                    'name': result.name,
                    'detail': details.join(', ')
                };
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

    _setGeocoder() {
        switch ( this.model.get('geocoder') ) {
            case CONST.geocoder.nominatim:
                this._geocoder = leafletControlGeocoder.nominatim();
                break;
            default:
                this._geocoder = leafletControlGeocoder.photon();
        }
    }
});
