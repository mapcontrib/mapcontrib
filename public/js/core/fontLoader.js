
import FontFaceObserver from 'fontfaceobserver';


export default class FontLoader {
    static load () {
        let fontPromises = [
            new FontFaceObserver('Fira Sans'),
            new FontFaceObserver('Ionicons'),
            new FontFaceObserver('FontAwesome'),
        ];

        return Promise.all(fontPromises);
    }
}
