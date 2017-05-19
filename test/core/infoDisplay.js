
import 'babel-polyfill';
import assert from 'assert';

import CONST from 'const';
import InfoDisplay from 'core/infoDisplay';
import ThemeModel from 'model/theme';
import LayerModel from 'model/layer';


describe('InfoDisplay', () => {
    describe('buildContent', () => {
        it('Should return an OverPass element\'s informations converted from Markdown to HTML', () => {
            const expected = `<h1 id="this-is-a-title">This is a title</h1>
<p>And this <em>is</em> <strong>recycling</strong> and .</p>
`;
            const themeModel = new ThemeModel();
            const layerModel = new LayerModel({
                type: CONST.layerType.overpass,
                popupContent: `# This is a title

And this *is* **{amenity}** and {other}.`,
            });
            const feature = {
                properties: {
                    tags: {
                        amenity: 'recycling',
                    },
                },
            };

            const result = InfoDisplay.buildContent(themeModel, layerModel, feature, [], true);

            assert.equal(result, expected);
        });

        it('Should return an other element\'s informations converted from Markdown to HTML', () => {
            const expected = `<h1 id="this-is-a-title">This is a title</h1>
<p>And this <em>is</em>  and <strong>stuff</strong>.</p>
`;
            const themeModel = new ThemeModel();
            const layerModel = new LayerModel({
                type: CONST.layerType.csv,
                popupContent: `# This is a title

And this *is* {amenity} and **{other}**.`,
            });
            const feature = {
                properties: {
                    other: 'stuff',
                },
            };

            const result = InfoDisplay.buildContent(themeModel, layerModel, feature, [], true);

            assert.equal(result, expected);
        });

        it('Should return an other element\'s informations converted from Markdown to HTML (with tags)', () => {
            const expected = `<h1 id="this-is-a-title">This is a title</h1>
<p>And this <em>is</em>  and <strong>stuff</strong>.</p>
`;
            const themeModel = new ThemeModel();
            const layerModel = new LayerModel({
                type: CONST.layerType.csv,
                popupContent: `# This is a title

And this *is* {amenity} and **{other}**.`,
            });
            const feature = {
                properties: {
                    tags: {
                        other: 'stuff',
                    },
                },
            };

            const result = InfoDisplay.buildContent(themeModel, layerModel, feature, [], true);

            assert.equal(result, expected);
        });

        it('Should return an empty string', () => {
            const expected = '';
            const themeModel = new ThemeModel();
            const layerModel = new LayerModel({
                type: CONST.layerType.overpass,
                popupContent: '',
            });
            const feature = {
                properties: {
                    tags: {
                        amenity: 'recycling',
                    },
                },
            };

            const result = InfoDisplay.buildContent(themeModel, layerModel, feature, [], true);

            assert.equal(result, expected);
        });
    });
});
