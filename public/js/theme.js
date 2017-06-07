
import Router from 'router/theme';
import ThemeRootView from 'view/themeRoot';
import App from './app';
import '../css/theme.less';


document.l10n.ready(
    () => new App(window).start({
        router: Router,
        rootView: ThemeRootView,
    })
);
