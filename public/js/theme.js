
import App from './app';
import Router from 'router/theme';
import '../css/theme.less';
import redirectToHttps from 'helper/forceHttps';


document.l10n.ready(() => {
    if (MAPCONTRIB.config.forceHttps) {
        return redirectToHttps(MAPCONTRIB.config.forceHttps);
    }

    return new App(window).start(Router);
});
