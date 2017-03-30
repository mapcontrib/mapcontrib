
import App from './app';
import PageNotFoundRootView from 'view/404Root';
import '../css/404.less';


document.l10n.ready(
    () => new App(window).start({
        rootView: PageNotFoundRootView,
    })
);
