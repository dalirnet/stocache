(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("stocache", [], factory);
	else if(typeof exports === 'object')
		exports["stocache"] = factory();
	else
		root["stocache"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// perfix
var PERFIX = 'stocache'; // support

var support = function (key) {
  try {
    localStorage.setItem(key, JSON.stringify(true));
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return false;
  }
}(PERFIX + '-' + 'support'); // json


var json = function json(value) {
  return {
    encode: function encode(fallback) {
      if (fallback === void 0) {
        fallback = '';
      }

      try {
        return JSON.stringify(value);
      } catch (e) {
        return fallback;
      }
    },
    decode: function decode(fallback) {
      if (fallback === void 0) {
        fallback = {};
      }

      try {
        return JSON.parse(value);
      } catch (e) {
        return fallback;
      }
    }
  };
}; // generator


var generator = function generator(perfix) {
  if (perfix === void 0) {
    perfix = PERFIX;
  }

  return {
    key: function key(value) {
      if (value === void 0) {
        value = perfix;
      }

      var code = 0;

      for (var i = 0; i < value.length; i++) {
        code = (code << 5) - code + value.charCodeAt(i);
        code = code & code;
      }

      return perfix + '-' + (code > 0 ? code : 'i' + Math.abs(code));
    }
  };
}; // stocache


var stocache = function stocache(perfix) {
  if (perfix === void 0) {
    perfix = PERFIX;
  }

  var storage = function storage(key) {
    if (key === void 0) {
      key = perfix;
    }

    var set = function set(value, retry) {
      if (value === void 0) {
        value = null;
      }

      if (retry === void 0) {
        retry = false;
      }

      try {
        localStorage.setItem(key, json(value).encode());
        return true;
      } catch (_ref) {
        var message = _ref.message;
        return false;
      }
    };

    var get = function get(fallback) {
      if (fallback === void 0) {
        fallback = false;
      }

      return json(localStorage.getItem(key) || fallback).decode(fallback);
    };

    return {
      set: set,
      get: get
    };
  };

  var shadow = function shadow(key) {
    if (key === void 0) {
      key = perfix;
    }

    var now = Math.floor(Date.now() / 1000);
    var keys = {
      shadow: generator(perfix).key(),
      storage: generator(perfix).key(key)
    };
    var context = storage(keys.shadow).get({});

    var set = function set(value, ttl) {
      if (storage(keys.storage).set(value, true)) {
        return keep(ttl, true);
      }

      return false;
    };

    var keep = function keep(ttl, condition) {
      if (condition === void 0) {
        condition = context[keys.storage];
      }

      if (condition) {
        context[keys.storage] = now + parseInt(ttl);
        return storage(keys.shadow).set(context);
      }

      return false;
    };

    var get = function get(fallback) {
      // console.log(map[keys.storage])
      return storage(keys.storage).get(fallback);
    };

    return {
      set: set,
      keep: keep,
      get: get
    };
  };

  return {
    support: support,
    set: function set(key, value, ttl) {
      if (value === void 0) {
        value = null;
      }

      if (ttl === void 0) {
        ttl = 300;
      }

      return support ? shadow(key).set(value, ttl) : false;
    },
    keep: function keep(key, ttl) {
      if (ttl === void 0) {
        ttl = 300;
      }

      return support ? shadow(key).keep(ttl) : false;
    },
    get: function get(key, fallback) {
      if (fallback === void 0) {
        fallback = false;
      }

      return support ? shadow(key).get(fallback) : fallback;
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (stocache);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.js");
/******/ })()
.default;
});
//# sourceMappingURL=index.js.map