
import App from './app';
import Router from './router/home';
import style from '../css/home.less';
import FontLoader from './core/fontLoader';


FontLoader.load().then(() => {
    document.l10n.ready(() => {
        new App(window).start(Router);
    });
});
