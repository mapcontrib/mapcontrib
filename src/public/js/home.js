
import App from './app';
import Router from './router/home';
import style from '../css/home.less';


document.l10n.ready( function () {
    new App(window).start(Router);
});
