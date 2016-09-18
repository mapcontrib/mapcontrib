
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import PresetNodeTagsList from 'ui/form/presetNodeTags';
import SearchList from 'ui/form/searchList';
import template from 'templates/admin/preset/presetEditColumn.ejs';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.routeOnClose,
                triggerRouteOnClose: this.options.triggerRouteOnClose,
            },
        };
    },

    ui: {
        column: '.column',
        name: '#preset_name',
        description: '#preset_description',
    },

    events: {
        reset: 'onReset',
        submit: 'onSubmit',
    },

    regions: {
        tagList: '.rg_tag_list',
        locales: '.rg_locales',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._oldModel = this.model.clone();
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onRender() {
        this._tagList = new PresetNodeTagsList({
            tags: this.options.theme.get('tags'),
            iDPresetsHelper: this.options.iDPresetsHelper,
        });
        // this._tagList = new PresetNodeTagsList({
        //     tags: this.options.theme.get('tags'),
        // });

        this.getRegion('tagList').show(this._tagList);

        const searchLocales = new SearchList({
            items: [
                {
                    label: 'Français',
                    progression: 100,
                    href: '#',
                    callback: undefined,
                },
                {
                    label: 'Anglais',
                    progression: 65,
                    href: '#',
                    callback: undefined,
                },
                {
                    label: 'Italien',
                    progression: 40,
                    href: '#',
                    callback: undefined,
                },
            ],
        });
        this.getRegion('locales').show(searchLocales);
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onSubmit(e) {
        e.preventDefault();

        this.model.set('name', this.ui.name.val().trim());
        this.model.set('description', this.ui.description.val().trim());
        this.model.set('tags', this._tagList.getTags());

        if (this.options.isNew) {
            this.options.theme.get('presets').add( this.model );
        }

        this.model.updateModificationDate();
        this.options.theme.updateModificationDate();
        this.options.theme.save({}, {
            success: () => this.close(),

            error: () => {
                // FIXME
                console.error('nok');
            },
        });
    },
});
