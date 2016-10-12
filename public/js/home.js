
import App from './app';
import Router from 'router/home';
import '../css/home.less';
import FontLoader from 'core/fontLoader';
import redirectToHttps from 'helper/forceHttps';


FontLoader.load().then(() => {
    document.l10n.ready(() => {
        if (MAPCONTRIB.config.forceHttps) {
            return redirectToHttps(MAPCONTRIB.config.forceHttps);
        }

        return new App(window).start(Router);
    });
});
