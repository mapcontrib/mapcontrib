

export default class FullscreenHelper {
    static isFullscreenAPISupported (document) {
        if (
            !document.fullscreenEnabled &&
            !document.mozFullScreenEnabled &&
            !document.webkitFullscreenEnabled &&
            !document.msFullscreenEnabled
        ) {
            return false;
        }
        else {
            return true;
        }
    }

    static onFullscreenChange (window, callback) {
        let eventName;

        if (document.fullscreenEnabled) {
            eventName = 'fullscreenchange';
        }
        else if (document.mozFullScreenEnabled) {
            eventName = 'mozfullscreenchange';
        }
        else if (document.webkitFullscreenEnabled) {
            eventName = 'webkitfullscreenchange';
        }
        else if (document.msFullscreenEnabled) {
            eventName = 'MSFullscreenChange';
        }

        if (window.addEventListener) {
            window.addEventListener(eventName, callback, false);
        }
        else {
            window.attachEvent(`on${eventName}`, callback);
        }
    }

    static getFullscreenElement (document) {
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
        else {
            return false;
        }
    }

    static requestFullscreen (element) {
        if (element.requestFullscreen) {
            return element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            return element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            return element.webkitRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            return element.msRequestFullscreen();
        }
        else {
            return false;
        }
    }

    static exitFullscreen (document) {
        if (document.exitFullscreen) {
            return document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            return document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            return document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            return document.msExitFullscreen();
        }
        else {
            return false;
        }
    }
}
