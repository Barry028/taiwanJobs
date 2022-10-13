// JsImagePlaceholder(".js-placeholder",{
//   bgColor: '#d7d3dc',
//   textColor: '#52406b'
// });
"use strict";

const JsImagePlaceholder = function(element, options) {

  if (typeof element === "undefined" || element === null) {
    return;
  }
  ///////////////////////////////
  // **  Private variables  ** //
  ///////////////////////////////
  const that = this;
  const body = document.getElementsByTagName("BODY")[0];

  if (typeof element === "undefined" || element === null) {
    return;
  }
  const defaultOptions = {
    width: '',
    height: '',
    text: '',
    fontFamily: "ellograph-cf, Ellograph CF, monospace",
    fontWeight: "700",
    fontSize: "24",
    dy: null,
    bgColor: "#d0d0d4",
    textColor: "#71717e",
    dataUri: true,
    charset: "UTF-8"
  };


  const _construct = function _construct() {
    if (JsUtils.data(element).has("image")) {
      that = JsUtils.data(element).get("image");
    } else {
      _init();
    }
  };
  const _init = function() {
    // Variables
    // that.options = JsUtils.deepExtend({}, defaultOptions, options);
    that.options = JsUtils.deepExtend({}, defaultOptions, options);
    that.uid = JsUtils.getUniqueId("image");
    that.element = element; // Set initialized
    that.element.setAttribute("data-tu-image", "true"); // Event Handlers

    _getOption();
    JsUtils.data(that.element).set("image", that);
  };


  const _getOption = function() {
    const elements = document.querySelectorAll('[data-tu-image="true"]');
    options = that.options;

    JsUtils.each(elements, function(event) {
      const width =
        event.getAttribute("data-tu-width") ||
        event.clientWidth ||
        options.width;
      const height =
        event.getAttribute("data-tu-height") ||
        event.clientHeight ||
        options.height;
      const fontSize =
        event.getAttribute("data-tu-font-size") ||
        Math.floor(Math.min(width, height) * 0.175) ||
        options.fontSize ||
        defaultOptions.fontSize;
      const dy =
        event.getAttribute("data-tu-dy") ||
        fontSize * 0.475 ||
        options.dy ||
        defaultOptions.dy;
      const fontFamily =
        event.getAttribute("data-tu-font-family") ||
        options.fontFamily ||
        defaultOptions.fontFamily;
      const fontWeight =
        event.getAttribute("data-tu-font-weight") ||
        options.fontWeight ||
        defaultOptions.fontWeight;
      const bgColor =
        event.getAttribute("data-tu-background") ||
        options.bgColor ||
        defaultOptions.bgColor;
      const textColor =
        event.getAttribute("data-tu-color") ||
        options.textColor ||
        defaultOptions.textColor;

      const text = event.getAttribute("data-tu-text") || options.text || width + " x " + height;

      const str = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                      <rect fill="${bgColor}" width="${width}" height="${height}"/>
                      <text fill="${textColor}" font-family="${fontFamily}" font-size="${fontSize}" dy="${dy}" font-weight="${fontWeight}" x="50%" y="50%" text-anchor="middle">${text}</text>
                    </svg>`;

      const cleaned = str
        .replace(/[\t\n\r]/gim, "")
        .replace(/\s\s+/g, " ")
        .replace(/'/gim, "\\i");

      if (options.dataUri) {
        const encoded = encodeURIComponent(cleaned)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29");

        event.title = "Placeholder " + text;
        event.alt = "Placeholder " + text;
        if (event.tagName === 'IMG') {
          event.src = `data:image/svg+xml;charset=${options.charset},${encoded}`;
        } else {
          event.style.backgroundImage = `url(data:image/svg+xml;charset=${options.charset},${encoded})`;
        }
      }
    });
  };
  _construct();
};

// Create
JsImagePlaceholder.createInstances = function() {
  var selector =
    arguments.length > 0 && arguments[0] !== undefined ?
    arguments[0] :
    '[data-tu-image="true"]';
  var body = document.getElementsByTagName("BODY")[0]; // Initialize Menus

  var elements = body.querySelectorAll(selector);
  var image;

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      image = new JsImagePlaceholder(elements[i]);
    }
  }
};

// Static
JsImagePlaceholder.getInstance = function(element) {
  if (element && JsUtils.data(element).has("image")) {
    return JsUtils.data(element).get("image");
  } else {
    return null;
  }
};

// Global
JsImagePlaceholder.init = function() {
  JsImagePlaceholder.createInstances();
};

// On document ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", JsImagePlaceholder.init);
} else {
  JsImagePlaceholder.init();
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = JsImagePlaceholder;
}


