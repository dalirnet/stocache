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
var config = {
  scope: 'stocache',
  ttl: 3600,
  exception: false
};

var support = function (key) {
  try {
    localStorage.setItem(key, JSON.stringify(true));
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return false;
  }
}(config.scope + '-' + 'support');

var Stocache = function Stocache(scope, exception) {
  if (scope === void 0) {
    scope = config.scope;
  }

  if (exception === void 0) {
    exception = config.exception;
  }

  var generator = function generator(scope) {
    return {
      key: function key(value) {
        if (value === void 0) {
          value = scope;
        }

        var code = 0;

        for (var i = 0; i < value.length; i++) {
          code = (code << 5) - code + value.charCodeAt(i);
          code = code & code;
        }

        return scope + '-' + (code > 0 ? code : 'i' + Math.abs(code));
      },
      exception: function exception(name, message) {
        if (name === void 0) {
          name = null;
        }

        if (message === void 0) {
          message = null;
        }

        return {
          scope: scope,
          name: name,
          message: message
        };
      }
    };
  };

  var json = function json(value) {
    return {
      encode: function encode(fallback) {
        if (fallback === void 0) {
          fallback = '';
        }

        try {
          return JSON.stringify(value);
        } catch (_ref) {
          var message = _ref.message;
          if (exception) throw generator(scope).exception('json.encode', message);
          return fallback;
        }
      },
      decode: function decode(fallback) {
        if (fallback === void 0) {
          fallback = {};
        }

        try {
          return JSON.parse(value);
        } catch (_ref2) {
          var message = _ref2.message;
          if (exception) throw generator(scope).exception('json.decode', message);
          return fallback;
        }
      }
    };
  };

  var storage = function storage(key) {
    if (key === void 0) {
      key = scope;
    }

    return {
      set: function set(value) {
        if (value === void 0) {
          value = null;
        }

        try {
          localStorage.setItem(key, json(value).encode());
          return true;
        } catch (_ref3) {
          var message = _ref3.message;
          if (exception) throw generator(scope).exception('storage.set', message);
          return false;
        }
      },
      unset: function unset() {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (_ref4) {
          var message = _ref4.message;
          if (exception) throw generator(scope).exception('storage.unset', message);
          return false;
        }
      },
      get: function get(fallback) {
        if (fallback === void 0) {
          fallback = false;
        }

        return json(localStorage.getItem(key)).decode(fallback);
      }
    };
  };

  var middleware = function middleware(key, now) {
    if (key === void 0) {
      key = scope;
    }

    if (now === void 0) {
      now = Math.floor(Date.now() / 1000);
    }

    var keys = {
      shadow: generator(scope).key(),
      storage: generator(scope).key(key)
    };
    var context = storage(keys.shadow).get() || {};

    var commit = function commit() {
      if (support) {
        return storage(keys.shadow).set(context);
      }

      return false;
    };

    var unset = function unset(key) {
      if (support) {
        delete context[key];
        return storage(key).unset();
      }

      return false;
    };

    var clean = function clean(_temp) {
      var _ref5 = _temp === void 0 ? {} : _temp,
          _ref5$flush = _ref5.flush,
          flush = _ref5$flush === void 0 ? false : _ref5$flush,
          _ref5$expireSoon = _ref5.expireSoon,
          expireSoon = _ref5$expireSoon === void 0 ? false : _ref5$expireSoon;

      var changed = false;
      var expireSoonKey = null;
      var expireSoonKTime = 0;

      for (var _i = 0, _Object$keys = Object.keys(context); _i < _Object$keys.length; _i++) {
        var _key = _Object$keys[_i];

        if (flush || context[_key] < now) {
          changed = true;
          unset(_key);
        } else if (expireSoon && (expireSoonKTime === 0 || closestItem.value > context[_key])) {
          changed = true;
          expireSoonKey = _key;
          expireSoonKTime = context[_key];
        }
      }

      return changed ? unset(expireSoonKey) && commit() : true;
    };

    var set = function set(value, ttl) {
      if (support) {
        if (scope !== key) {
          var writed = storage(keys.storage).set(value);

          if (!writed) {
            clean();
            writed = storage(keys.storage).set(value);
          }

          if (!writed) {
            clean({
              expireSoon: true
            });
            writed = storage(keys.storage).set(value);
          }

          if (!writed) {
            clean({
              flush: true
            });
            writed = storage(keys.storage).set(value);
          }

          return writed ? keep(ttl, true) : false;
        } else {
          if (exception) throw generator(scope).exception('middleware.set', 'KeyConflict');
        }
      }

      return false;
    };

    var keep = function keep(ttl, condition) {
      if (condition === void 0) {
        condition = has(keys.storage);
      }

      if (support && condition) {
        context[keys.storage] = now + parseInt(ttl);
        return storage(keys.shadow).set(context);
      }

      return false;
    };

    var has = function has(key) {
      return clean() && context[key] && context[key] >= now;
    };

    var get = function get(fallback) {
      if (support && has(keys.storage)) {
        return storage(keys.storage).get(fallback);
      }

      return fallback;
    };

    return {
      set: set,
      unset: unset,
      has: has,
      keep: keep,
      get: get
    };
  };

  return {
    support: support,
    keyGenerator: function keyGenerator(key) {
      if (key === void 0) {
        key = config.scope;
      }

      return generator(scope).key(key);
    },
    set: function set(key, value, ttl) {
      if (key === void 0) {
        key = null;
      }

      if (value === void 0) {
        value = null;
      }

      if (ttl === void 0) {
        ttl = config.ttl;
      }

      return middleware(key).set(value, ttl);
    },
    unset: function unset(key) {
      if (key === void 0) {
        key = null;
      }

      return middleware(key).unset();
    },
    has: function has(key) {
      if (key === void 0) {
        key = null;
      }

      return middleware(key).has();
    },
    keep: function keep(key, ttl) {
      if (key === void 0) {
        key = null;
      }

      if (ttl === void 0) {
        ttl = config.ttl;
      }

      return middleware(key).keep(ttl);
    },
    get: function get(key, fallback) {
      if (key === void 0) {
        key = null;
      }

      if (fallback === void 0) {
        fallback = false;
      }

      return middleware(key).get(fallback);
    },
    flush: function flush(scope) {
      if (scope === void 0) {
        scope = config.scope;
      }

      return middleware(scope).clean({
        flush: true
      });
    },
    cleanExpired: function cleanExpired(scope) {
      if (scope === void 0) {
        scope = config.scope;
      }

      return middleware(scope).clean();
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Stocache);

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