
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import settings from '../settings';
import leafletControlGeocoder from 'leaflet-control-geocoder';
import template from '../../templates/geocodeWidget.ejs';
import templateResultItem from '../../templates/geocodeResultItem.ejs';


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

        this._geocoder = leafletControlGeocoder.nominatim();

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
            results.forEach((result) => {
                elements.push(

                    $( this.templateResultItem({
                        'name': result.name,
                    }))
                    .on('click', () => {
                        this._radio.commands.execute('map:fitBounds', result.bbox);

                        this.close();
                    })
                );
            });

            this.ui.resultList.html( elements );
        });

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
