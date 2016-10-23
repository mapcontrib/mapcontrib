

export default class FullscreenHelper {
    static isFullscreenAPISupported(document) {
        if (
            !document.fullscreenEnabled &&
            !document.mozFullScreenEnabled &&
            !document.webkitFullscreenEnabled &&
            !document.msFullscreenEnabled
        ) {
            return false;
        }

        return true;
    }

    static onFullscreenChange(window, callback) {
        let eventName;

        if (window.document.fullscreenEnabled) {
            eventName = 'fullscreenchange';
        }
        else if (window.document.mozFullScreenEnabled) {
            eventName = 'mozfullscreenchange';
        }
        else if (window.document.webkitFullscreenEnabled) {
            eventName = 'webkitfullscreenchange';
        }
        else if (window.document.msFullscreenEnabled) {
            eventName = 'MSFullscreenChange';
        }

        if (window.addEventListener) {
            window.addEventListener(eventName, callback, false);
        }
        else {
            window.attachEvent(`on${eventName}`, callback);
        }
    }

    static getFullscreenElement(document) {
        if (document.fullscreenElement) {
            return document.fullscreenElement;
        }
        else if (document.mozFullScreenElement) {
            return document.mozFullScreenElement;
        }
        else if (document.webkitCurrentFullScreenElement) {
            return document.webkitCurrentFullScreenElement;
        }
        else if (document.msFullscreenElement) {
            return document.msFullscreenElement;
        }

        return false;
    }

    static requestFullscreen(element) {
        if (element.requestFullscreen) {
            return element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            return element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullScreen) {
            return element.webkitRequestFullScreen();
        }
        else if (element.msRequestFullscreen) {
            return element.msRequestFullscreen();
        }

        return false;
    }

    static exitFullscreen(document) {
        if (document.exitFullscreen) {
            return document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            return document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen) {
            return document.webkitExitFullscreen();
        }
        else if (document.msExitFullscreen) {
            return document.msExitFullscreen();
        }

        return false;
    }
}
