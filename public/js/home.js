import Router from 'router/home';
import HomeRootView from 'view/homeRoot';
import App from './app';
import '../css/home.less';

document.l10n.ready(() =>
  new App(window).start({
    router: Router,
    rootView: HomeRootView
  })
);
