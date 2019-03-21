"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

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

function middleware() {
  for (
    var _len = arguments.length, fs = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    fs[_key] = arguments[_key];
  }

  return function() {
    for (
      var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2];
    }

    for (var i = 0; i < fs.length; i += 1) {
      var currentF = fs[i];

      if (typeof currentF !== "function") {
        throw new TypeError(
          "middleware takes only functions, but " +
            i +
            "-th parameter is not a function"
        );
      }

      var isFinished = false,
        finishArgs = [],
        isNext = false,
        nextArgs = [];

      var finish = function finish() {
        isFinished = true;

        for (
          var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
          _key3 < _len3;
          _key3++
        ) {
          args[_key3] = arguments[_key3];
        }

        finishArgs = args;
      };

      var next = function next() {
        isNext = true;

        for (
          var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
          _key4 < _len4;
          _key4++
        ) {
          args[_key4] = arguments[_key4];
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