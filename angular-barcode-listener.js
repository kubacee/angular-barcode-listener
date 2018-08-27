(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                throw new Error("Cannot find module '" + o + "'")
            }
            var f = n[o] = {exports: {}};
            t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, f, f.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
// Generated by CoffeeScript 1.10.0
        var barcodeScanListener;

        barcodeScanListener = require('barcode-scan-listener');


        /*
        Listen for scan with specified product prefix.
        @param [Function] onScan - callback to call when scan is successful. Passes the scanned string.
        @param [String] prefix - character prefix that appears before the scanned string (e.g. 'P%', 'C%')
         */

        module.exports = angular.module('barcodeListener', []).directive('barcodeListener', function () {
            return {
                restrict: 'EA',
                scope: {
                    onScan: '=',
                    prefix: '@',
                    length: '@'
                },
                link: function (scope, element, attrs) {
                    var removeScanListener;
                    removeScanListener = barcodeScanListener.onScan({
                        barcodePrefix: scope.prefix,
                        barcodeLength: +scope.length || void 0,
                    }, scope.onScan);
                    return element.on('$destroy', removeScanListener);
                }
            };
        });

    }, {"barcode-scan-listener": 2}], 2: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        /* eslint-env browser */

        exports.default = {
            /**
             * Listen for scan with specified characteristics
             * @param  {String} scanCharacteristics.barcodePrefix
             * @param  {Number} [scanCharacteristics.barcodeLength] - if provided, the listener will
             * wait for this many characters to be read before calling the handler
             * @param  {Function} scanHandler - called with the results of the scan
             * @return {Function} remove this listener
             */

            onScan: function onScan() {
                var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var barcodePrefix = _ref.barcodePrefix;
                var barcodeLength = _ref.barcodeLength;
                var scanHandler = arguments[1];

                if (typeof barcodePrefix !== 'string') {
                    throw new TypeError('barcodePrefix must be a string');
                }
                if (typeof barcodeLength !== 'number') {
                    throw new TypeError('barcodeLength must be a number');
                }
                if (typeof scanHandler !== 'function') {
                    throw new TypeError('scanHandler must be a function');
                }

                /**
                 * SwipeTrack calls this function, if defined, whenever a barcode is scanned
                 * within the SwipeTrack browser.  See "SwipeTrack Browser JavaScript Functions" section of
                 * SwipeTrack API: http://swipetrack.net/support/faq/pdf/SwipeTrack%20API%20(v5.0.0).pdf
                 */
                if (typeof window.onScanAppBarCodeData !== 'function') {
                    window.onScanAppBarCodeData = function (barcode) {
                        window.onScanAppBarCodeData.scanHandlers.forEach(function (handler) {
                            return handler(barcode);
                        });
                        return true;
                    };
                    window.onScanAppBarCodeData.scanHandlers = [];
                }
                var swipeTrackHandler = function swipeTrackHandler(barcode) {
                    if (barcode.match('^' + barcodePrefix) !== null) scanHandler(barcode.slice(barcodePrefix.length));
                };
                window.onScanAppBarCodeData.scanHandlers.push(swipeTrackHandler);

                var codeBuffer = '';
                var scannedPrefix = '';
                var finishScan = function finishScan() {
                    if (codeBuffer) {
                        scanHandler(codeBuffer);
                    }
                    scannedPrefix = '';
                    codeBuffer = '';
                };
                var keypressHandler = function keypressHandler(e) {
                    var char = String.fromCharCode(e.which);
                    var charIndex = barcodePrefix.indexOf(char);
                    var expectedPrefix = barcodePrefix.slice(0, charIndex);

                    if (codeBuffer.length && e.which === 13) {
                        finishScan();
                    }

                    if (scannedPrefix === barcodePrefix && /[^\s]/.test(char)) {
                        codeBuffer += char;
                    } else if (scannedPrefix === expectedPrefix && char === barcodePrefix.charAt(charIndex)) {
                        scannedPrefix += char;
                    }
                };
                var removeListener = function removeListener() {
                    document.removeEventListener('keypress', keypressHandler);
                    var swipeTrackHandlerIndex = window.onScanAppBarCodeData.scanHandlers.indexOf(swipeTrackHandler);
                    if (swipeTrackHandlerIndex >= 0) window.onScanAppBarCodeData.scanHandlers.splice(swipeTrackHandlerIndex, 1);
                };
                document.addEventListener('keypress', keypressHandler);
                return removeListener;
            }
        };
        module.exports = exports['default'];
    }, {}]
}, {}, [1])