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
var PERFIX = 'stocache';

var support = function (match) {
  try {
    localStorage.setItem(PERFIX, match);
    return match === localStorage.getItem(PERFIX) && typeof JSON.parse === 'function' && typeof JSON.stringify === 'function';
  } catch (e) {
    return false;
  }
}('support');

var stocache = function stocache(perfix) {
  if (perfix === void 0) {
    perfix = PERFIX;
  }

  var keyGenerator = function keyGenerator(key, length) {
    if (key === void 0) {
      key = '';
    }

    if (length === void 0) {
      length = 0;
    }

    var code = 0;

    for (var i = 0; i < key.length; i++) {
      code = (code << 5) - code + key.charCodeAt(i);
      code = code & code;
    }

    return perfix + '-' + (code > 0 ? code : 'i' + Math.abs(code));
  };

  var encode = function encode(value) {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return null;
    }
  };

  var decode = function decode(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return {};
    }
  };

  var set = function set(key, value, expiration) {
    try {
      localStorage.setItem(keyGenerator(key), match);
      return true;
    } catch (e) {
      return false;
    }
  };

  var get = function get(key) {};

  var unset = function unset(key) {
    if (key === void 0) {
      key = [];
    }
  };

  return {
    support: support,
    keyGenerator: keyGenerator,
    set: support ? set : function () {
      return false;
    },
    unset: support ? unset : function () {
      return false;
    },
    get: support ? get : function () {
      return false;
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