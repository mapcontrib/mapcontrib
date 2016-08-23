
import marked from 'marked';

let renderer = new marked.Renderer();


renderer.link = (href, title, text) => {
    let attributesList = [
        `href="${href}"`,
        `target="_blank"`
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
    static render (markdownString) {
        return marked(markdownString, { renderer });
    }
}
