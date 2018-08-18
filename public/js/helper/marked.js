import dompurify from 'dompurify';
import marked from 'marked';

dompurify.addHook('afterSanitizeAttributes', function(node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
  // set non-HTML/MathML links to xlink:show=new
  if (
    !node.hasAttribute('target') &&
    (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
  ) {
    node.setAttribute('xlink:show', 'new');
  }
});

export default class MarkedHelper {
  /**
   * @author Guillaume AMAT
   * @static
   * @access public
   * @param {string} markdown - A markdown string to transform into HTML.
   * @returns {string}
   */
  static render(markdownString) {
    return dompurify.sanitize(marked(markdownString));
  }
}
