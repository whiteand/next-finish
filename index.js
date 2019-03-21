"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = middleware;

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function middleware() {
  for (
    var _len = arguments.length, fsOrConditional = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    fsOrConditional[_key] = arguments[_key];
  }

  var fs = fsOrConditional.map(function(f, ind) {
    if (typeof f === "function") return f;

    if (Array.isArray(f) && f.length === 2) {
      var _f = _slicedToArray(f, 2),
        cond = _f[0],
        handler = _f[1];

      return function(n, f) {
        for (
          var _len2 = arguments.length,
            args = new Array(_len2 > 2 ? _len2 - 2 : 0),
            _key2 = 2;
          _key2 < _len2;
          _key2++
        ) {
          args[_key2 - 2] = arguments[_key2];
        }

        if (cond.apply(void 0, args)) {
          f(handler.apply(void 0, args));
        }

        n.apply(void 0, args);
      };
    }

    throw new TypeError(
      "middleware takes only functions or [cond, handler], but " +
        i +
        "-th parameter is not a function or [cond, handler]"
    );
  });
  return function() {
    for (
      var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
      _key3 < _len3;
      _key3++
    ) {
      args[_key3] = arguments[_key3];
    }

    for (var _i2 = 0; _i2 < fs.length; _i2 += 1) {
      var currentF = fs[_i2];
      var isFinished = false,
        finishArgs = [],
        isNext = false,
        nextArgs = [];

      var finish = function finish() {
        isFinished = true;

        for (
          var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
          _key4 < _len4;
          _key4++
        ) {
          args[_key4] = arguments[_key4];
        }

        finishArgs = args;
      };

      var next = function next() {
        isNext = true;

        for (
          var _len5 = arguments.length, args = new Array(_len5), _key5 = 0;
          _key5 < _len5;
          _key5++
        ) {
          args[_key5] = arguments[_key5];
        }

        nextArgs = args;
      };

      currentF.apply(void 0, [next, finish].concat(_toConsumableArray(args)));

      if (isFinished) {
        return finishArgs.length <= 1 ? finishArgs[0] : finishArgs;
      }

      if (isNext) {
        args = nextArgs;
        continue;
      }

      return undefined;
    }
  };
}
