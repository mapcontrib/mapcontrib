
import 'babel-polyfill';
import assert from 'assert';

import PopupContent from '../../src/public/js/core/popupContent';



describe('PopupContent', () => {

    describe('findTagsFromContent', () => {

        it('Should return tag list', () => {

            const expected = ['amenity', 'other_tag'];
            const popupContent = 'This text contains the {amenity} tag and an {other_tag}.';

            let result = PopupContent.findTagsFromContent(popupContent);

            assert.deepEqual(result, expected);
        });

        it('Should return an empty tag list', () => {

            const expected = [];
            const popupContent = 'This text does not contain tags!';

            let result = PopupContent.findTagsFromContent(popupContent);

            assert.deepEqual(result, expected);
        });
    });
});
