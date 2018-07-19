"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Brain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Neuron = require("./Neuron");

var _Neuron2 = _interopRequireDefault(_Neuron);

var _evoHelpers = require("./evoHelpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Brain = exports.Brain = function () {
    function Brain(_ref) {
        var _ref$neurons = _ref.neurons,
            neurons = _ref$neurons === undefined ? [] : _ref$neurons;

        _classCallCheck(this, Brain);

        /**
         * @type {Neuron[]} neurons
         * @type {Neuron[]} inputs
         * @type {Neuron[]} outputs
         */
        this.neurons = neurons;
        this.inputs = [];
        this.outputs = [];
        this.parseIO();
    }

    /**
     * Iterate through neurons,
     * push inputs and output into their buffers.
     */


    _createClass(Brain, [{
        key: "parseIO",
        value: function parseIO() {
            var _this = this;

            this.neurons.forEach(function (n) {
                switch (n.type) {
                    case _Neuron.Types.INPUT:
                        _this.inputs.push(n);
                        break;
                    case _Neuron.Types.OUTPUT:
                        _this.outputs.push(n);
                        break;
                }
            });
        }

        /**
         * Breed two brains to return a third brain.
         * @param {Brain} a
         * @param {Brain} b
         * @return {Brain}
         */

    }], [{
        key: "cross",
        value: function cross(a, b) {
            var c = {
                neurons: []
            };
            for (var i = 0; i < Math.max(a.neurons.length, b.neurons.length); i++) {
                /**
                 * Get the neuron at this index for both neurons.
                 * This may be undefined for one neuron.
                 * @type {Neuron} nA
                 * @type {Neuron} nB
                 */
                var nA = a.neurons[i];
                var nB = b.neurons[i];

                if (nA && nB) {
                    if (Math.random() < 0.995) {
                        c.neurons.push((0, _evoHelpers.rndTrinary)(nA, nB, _Neuron2.default.cross(nA, nB)));
                    } else {
                        c.neurons.push(nA, nB);
                    }
                } else if ((0, _evoHelpers.rndBool)()) {
                    c.neurons.push(nA || nB);
                }
            }
            return new Brain(c);
        }
    }]);

    return Brain;
}();
//# sourceMappingURL=Brain.js.map