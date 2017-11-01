export default class Device {
  constructor(config, window) {
    this._config = config;
    this._window = window;
  }

  isTallScreen() {
    if ($(this._window).height() >= this._config.largeScreenMinHeight) {
      return true;
    }

    return false;
  }

  isLargeScreen() {
    if (
      $(this._window).width() >= this._config.largeScreenMinWidth &&
      $(this._window).height() >= this._config.largeScreenMinHeight
    ) {
      return true;
    }

    return false;
  }
}
