import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const dompurify = createDOMPurify(window);

export default function sanitizer(htmlString) {
  return dompurify.sanitize(htmlString);
}
