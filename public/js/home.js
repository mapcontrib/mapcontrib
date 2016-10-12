
import App from './app';
import Router from 'router/home';
import '../css/home.less';
import redirectToHttps from 'helper/forceHttps';


document.l10n.ready(() => {
    if (MAPCONTRIB.config.forceHttps) {
        redirectToHttps(MAPCONTRIB.config.forceHttps);
    }

    return new App(window).start(Router);
});
