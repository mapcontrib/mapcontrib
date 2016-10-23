
import App from './app';
import Router from 'router/home';
import '../css/home.less';


document.l10n.ready(() => new App(window).start(Router));
