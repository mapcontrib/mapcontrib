
import App from './app';
import Router from 'router/theme';
import '../css/theme.less';
import FontLoader from 'core/fontLoader';


FontLoader.load().then(() => {
    document.l10n.ready(() => {
        new App(window).start(Router);
    });
});
