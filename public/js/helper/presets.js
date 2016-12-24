

export default class PresetsHelper {
    constructor(theme, iDHelper) {
        this._theme = theme;
        this._iDHelper = iDHelper;
    }

    hydrateTag(tag) {
        // FIXME - Have to take care of the multi-keys case
        if (!tag.key) {
            return false;
        }

        const customTags = this._theme.get('tags');
        let field = customTags.findWhere({ key: tag.key });

        if (field) {
            tag.type = field.get('type');
            return tag;
        }

        field = this._iDHelper.getField(tag.key);

        // FIXME - Have to take care of the multi-keys case
        if (field && field.key) {
            tag.type = field.type;
            return tag;
        }

        return tag;
    }

    fillTagListWithCustomPreset(tagList, preset) {
        for (const tag of preset.get('tags')) {
            tagList.addTag(
                this.hydrateTag(tag)
            );
        }
    }

    fillTagListWithIDPreset(tagList, presetName) {
        const preset = this._iDHelper.getPreset(presetName);

        if (preset.fields) {
            for (const fieldName of preset.fields) {
                if ({}.hasOwnProperty.bind(preset.fields, fieldName)) {
                    const field = this._iDHelper.getField(fieldName);

                    tagList.addTag(
                        this.hydrateTag(field)
                    );
                }
            }
        }

        if (preset.tags) {
            for (const tagName in preset.tags) {
                if ({}.hasOwnProperty.bind(preset.tags, tagName)) {
                    let value = preset.tags[tagName];

                    if (value === '*') {
                        value = '';
                    }

                    tagList.addTag(
                        this.hydrateTag({
                            key: tagName,
                            value,
                        })
                    );
                }
            }
        }
    }
}
