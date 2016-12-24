
import marked from 'marked';

const renderer = new marked.Renderer();


renderer.link = (href, title, text) => {
    const attributesList = [
        `href="${href}"`,
        'rel="noopener noreferrer"',
        'target="_blank"',
    ];

    if (title) {
        attributesList.push(`title="${title}"`);
    }

    const attributes = attributesList.join(' ');

    return `<a ${attributes}>${text}</a>`;
};


export default class MarkedHelper {
    /**
     * @author Guillaume AMAT
     * @static
     * @access public
     * @param {string} markdown - A markdown string to transform into HTML.
     * @returns {string}
     */
    static render(markdownString) {
        return marked(markdownString, { renderer });
    }
}
