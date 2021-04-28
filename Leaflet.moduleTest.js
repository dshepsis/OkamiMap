//Originally copied from https://github.com/Leaflet/Leaflet.fullscreen/blob/gh-pages/dist/Leaflet.fullscreen.js
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['leaflet'], factory);
  } else if (typeof module !== 'undefined') {
    // Node/CommonJS
    module.exports = factory(require('leaflet'));
  } else {
    // Browser globals
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet must be loaded first');
    }
    factory(window.L);
  }
}(function (L) {
  // L.Control.MarkerThumbnail = L.Control.extend({
  //   onAdd: function(map) {
  //     var img = L.DomUtil.create('img');
      
  //     img.src = './favicon-32x32.png';
  //     img.style.width = '200px';
      
  //     return img;
  //   },
    
  //   onRemove: function(map) {
  //     // Nothing to do here
  //   }
  // });
  
  // L.control.markerThumbnail = function(opts) {
  //   return new L.Control.MarkerThumbnail(opts);
  // }
  
  // L.control.markerThumbnail({ position: 'bottomright' }).addTo(map);
  //Below is the fullscreen implementation.
  L.Control.LayerPreview = L.Control.extend({
    options: {
      position: 'bottomright',
      defaultSrc: './favicon.ico',
      width: '320px',
      height: '180px'
    },

    onAdd: function (map) {
      const container = L.DomUtil.create('div', 'leaflet-control-preview leaflet-bar leaflet-control');

      this.image = L.DomUtil.create('img', 'leaflet-control-preview-image leaflet-bar-part', container);
      this.image.src = this.options.defaultSrc;
      this.image.style.width = this.options.width;
      this.image.style.height = this.options.height;
      this.image.style.display = "block";

      this._map = map;
      // this._map.on('fullscreenchange', this._toggleTitle, this);
      // this._toggleTitle();

      L.DomEvent.on(this.image, 'click', this._click, this);

      return container;
    },

    onRemove: function(map) {
      // Nothing to do here
    },

    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      // this._map.toggleFullscreen(this.options);
    },

    // _toggleTitle: function() {
    //   this.link.title = this.options.title[this._map.isFullscreen()];
    // }
  });

  L.Map.include({
    setPreviewImage: function (url) {
      this.layerPreview.image.src = url;
    },
    // isFullscreen: function () {
    //   return this._isFullscreen || false;
    // },

    // toggleFullscreen: function (options) {
    //   var container = this.getContainer();
    //   if (this.isFullscreen()) {
    //     if (options && options.pseudoFullscreen) {
    //       this._disablePseudoFullscreen(container);
    //     } else if (document.exitFullscreen) {
    //       document.exitFullscreen();
    //     } else if (document.mozCancelFullScreen) {
    //       document.mozCancelFullScreen();
    //     } else if (document.webkitCancelFullScreen) {
    //       document.webkitCancelFullScreen();
    //     } else if (document.msExitFullscreen) {
    //       document.msExitFullscreen();
    //     } else {
    //       this._disablePseudoFullscreen(container);
    //     }
    //   } else {
    //     if (options && options.pseudoFullscreen) {
    //       this._enablePseudoFullscreen(container);
    //     } else if (container.requestFullscreen) {
    //       container.requestFullscreen();
    //     } else if (container.mozRequestFullScreen) {
    //       container.mozRequestFullScreen();
    //     } else if (container.webkitRequestFullscreen) {
    //       container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    //     } else if (container.msRequestFullscreen) {
    //       container.msRequestFullscreen();
    //     } else {
    //       this._enablePseudoFullscreen(container);
    //     }
    //   }

    // },

    // _enablePseudoFullscreen: function (container) {
    //   L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
    //   this._setFullscreen(true);
    //   this.fire('fullscreenchange');
    // },

    // _disablePseudoFullscreen: function (container) {
    //   L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
    //   this._setFullscreen(false);
    //   this.fire('fullscreenchange');
    // },

    // _setFullscreen: function(fullscreen) {
    //   this._isFullscreen = fullscreen;
    //   var container = this.getContainer();
    //   if (fullscreen) {
    //     L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
    //   } else {
    //     L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
    //   }
    //   this.invalidateSize();
    // },

    // _onFullscreenChange: function (e) {
    //   var fullscreenElement =
    //     document.fullscreenElement ||
    //     document.mozFullScreenElement ||
    //     document.webkitFullscreenElement ||
    //     document.msFullscreenElement;

    //   if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
    //     this._setFullscreen(true);
    //     this.fire('fullscreenchange');
    //   } else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
    //     this._setFullscreen(false);
    //     this.fire('fullscreenchange');
    //   }
    // }
  });

  L.Map.mergeOptions({
    layerPreview: false
  });

  L.Map.addInitHook(function () {
    if (this.options.layerPreview) {
      /* When you pass an argument to new L.Control.LayerPreview, it marges the
       * arguments with the options object. This means you generally have to
       * pass in an object. If you pass in a string, for example, it will
       * interpret it as an array, and add a key for each index with the value
       * being each letter of that string. */ 
      // this.layerPreview = new L.Control.LayerPreview(this.options.layerPreview); //WRONG
      this.layerPreview = new L.Control.LayerPreview(); //Good, unless we want extra parameters
      this.addControl(this.layerPreview);
    }

    // var fullscreenchange;

    // if ('onfullscreenchange' in document) {
    //   fullscreenchange = 'fullscreenchange';
    // } else if ('onmozfullscreenchange' in document) {
    //   fullscreenchange = 'mozfullscreenchange';
    // } else if ('onwebkitfullscreenchange' in document) {
    //   fullscreenchange = 'webkitfullscreenchange';
    // } else if ('onmsfullscreenchange' in document) {
    //   fullscreenchange = 'MSFullscreenChange';
    // }

    // if (fullscreenchange) {
    //   var onFullscreenChange = L.bind(this._onFullscreenChange, this);

    //   this.whenReady(function () {
    //     L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
    //   });

    //   this.on('unload', function () {
    //     L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
    //   });
    // }
  });

  L.control.layerPreview = function (options) {
    return new L.Control.LayerPreview(options);
  };
}));