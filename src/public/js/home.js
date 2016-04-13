
import App from './app';
import Router from './router/home';


document.l10n.ready( function () {
    new App(window).start(Router);
});
