class Widget {
  setFocus(uiElement) {
    if (this._focusTimeout) {
      clearTimeout(this._focusTimeout);
    }

    this._focusTimeout = setTimeout(() => {
      if (typeof uiElement !== 'string') {
        uiElement.focus();
      }
    }, 200);
  }
}

export default new Widget();
