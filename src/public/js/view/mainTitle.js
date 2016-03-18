

define([

    'underscore',
    'backbone',
    'backbone.marionette',
    'bootstrap',
    '../../templates/templates',
    '../const',
    'marked',
],
function (

    _,
    Backbone,
    Marionette,
    Bootstrap,
    templates,
    CONST,
    marked
) {

    'use strict';

    return Marionette.LayoutView.extend({

        template: JST['mainTitle.html'],

        behaviors: {

            'l20n': {},
        },

        ui: {

            'titleWrapper': '#title',
            'title': '#title h1',
            'description': '#title .description',
            'descriptionButton': '#title .description_btn',
        },

        events: {

            'click @ui.descriptionButton': 'onClickDescription',
        },

        initialize: function () {

            var self = this;

            this._radio = Backbone.Wreqr.radio.channel('global');

            this._currentTitleColor = this.model.get('color');

            this.listenTo(this.model, 'change:name', this.setTitle);
            this.listenTo(this.model, 'change:description', this.setDescription);

            this._radio.commands.setHandler('ui:setTitleColor', this.commandSetTitleColor, this);
        },

        templateHelpers: function () {

            return {

                'description': marked( this.model.get('description') ),
            };
        },

        onRender: function () {

            var self = this;

            document.title = document.l10n.getSync('pageTitleWithMapName', {

                'map': {

                    'name': this.model.get('name')
                }
            });


            if ( this.model.get('description') ) {

                this.ui.descriptionButton.removeClass('hide');
            }
        },

        onShow: function () {

            this.ui.descriptionButton.tooltip({

                'container': 'body',
                'delay': {

                    'show': CONST.tooltip.showDelay,
                    'hide': CONST.tooltip.hideDelay
                }
            })
            .on('click', function () {

                $(this)
                .blur()
                .tooltip('hide');
            });
        },

        setTitle: function () {

            this.ui.title.html( this.model.get('name') );

            document.title = document.l10n.getSync('pageTitleWithMapName', {

                'map': {

                    'name': this.model.get('name')
                }
            });
        },

        commandSetTitleColor: function (color) {

            if ( this._currentTitleColor === color ) {

                return;
            }

            this.ui.titleWrapper
            .addClass( color )
            .removeClass( this._currentTitleColor );

            this._currentTitleColor = color;
        },

        setDescription: function () {

            var description = marked( this.model.get('description') );

            if ( description ) {

                this.ui.description.html( description );
                this.ui.descriptionButton.removeClass('hide');
            }
            else {

                this.ui.description.html('');
                this.ui.descriptionButton.addClass('hide');
            }
        },

        onClickDescription: function () {

            this._radio.vent.trigger('column:closeAll');
            this._radio.vent.trigger('widget:closeAll');

            this.ui.titleWrapper.toggleClass('open');
        },
    });
});
