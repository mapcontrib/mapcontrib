
import App from './app';
import Router from 'router/theme';
import '../css/theme.less';


document.l10n.ready(() => new App(window).start(Router));
