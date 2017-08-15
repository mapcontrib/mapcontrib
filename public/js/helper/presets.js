import CONST from 'const';
import TextField from 'ui/form/fields/text';
import EmailField from 'ui/form/fields/email';
import TextareaField from 'ui/form/fields/textarea';
import UrlField from 'ui/form/fields/url';
import TelField from 'ui/form/fields/tel';
import NumberField from 'ui/form/fields/number';
import FileField from 'ui/form/fields/file';
import CheckField from 'ui/form/fields/check';
import DefaultCheckField from 'ui/form/fields/defaultCheck';
import ComboField from 'ui/form/fields/combo';
import TypeComboField from 'ui/form/fields/typeCombo';
// import MultiComboField from 'ui/form/fields/multiCombo';

export default class PresetsHelper {
  constructor(customTags, iDHelper) {
    this._customTags = customTags;
    this._iDHelper = iDHelper;
  }

  hydrateTag(tag) {
    // FIXME - Have to take care of the multi-keys case
    if (!tag.key) {
      return false;
    }

    let field = this._customTags.findWhere({ key: tag.key });

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
      tagList.addTag(this.hydrateTag(tag));
    }
  }

  fillTagListWithIDPreset(tagList, presetName) {
    const preset = this._iDHelper.getPreset(presetName);

    if (preset.fields) {
      for (const fieldName of preset.fields) {
        if ({}.hasOwnProperty.bind(preset.fields, fieldName)) {
          const field = this._iDHelper.getField(fieldName);

          tagList.addTag(this.hydrateTag(field));
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
              value
            })
          );
        }
      }
    }
  }

  findTagType(key) {
    const customTag = this._customTags.findWhere({ key });
    const iDTag = this._iDHelper.getField(key);

    if (customTag) {
      return customTag.get('type');
    }

    if (iDTag) {
      switch (iDTag.type) {
        // If no custom tag is present to fill the combo options
        case CONST.tagType.typeCombo:
        case CONST.tagType.combo:
          return CONST.tagType.text;

        default:
          return iDTag.type;
      }
    }

    return CONST.tagType.text;
  }

  buildValueField(key, value, fieldOptions) {
    let tagType = this.findTagType(key);

    switch (tagType) {
      case CONST.tagType.check:
      case CONST.tagType.defaultCheck:
        if (value && ['yes', 'no'].indexOf(value) === -1) {
          tagType = CONST.tagType.text;
        }
        break;
      default:
    }

    switch (tagType) {
      case CONST.tagType.text:
        return new TextField(fieldOptions);
      case CONST.tagType.email:
        return new EmailField(fieldOptions);
      case CONST.tagType.url:
        return new UrlField(fieldOptions);
      case CONST.tagType.textarea:
        return new TextareaField(fieldOptions);
      case CONST.tagType.tel:
        return new TelField(fieldOptions);
      case CONST.tagType.number:
        return new NumberField(fieldOptions);
      case CONST.tagType.file:
        return new FileField(fieldOptions);
      case CONST.tagType.check:
        return new CheckField(fieldOptions);
      case CONST.tagType.defaultCheck:
        return new DefaultCheckField(fieldOptions);
      case CONST.tagType.combo:
        return new ComboField(fieldOptions);
      case CONST.tagType.typeCombo:
        return new TypeComboField(fieldOptions);
      // case CONST.tagType.multiCombo:
      //     return new MultiComboField( fieldOptions );
      default:
        return new TextField(fieldOptions);
    }
  }
}
