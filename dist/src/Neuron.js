'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Types = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.randomType = randomType;

var _evoHelpers = require('./evoHelpers');

var _enumify = require('enumify');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//TODO: Create Brain to contain and manage neurons.

/** The possible types for a neuron.
 * Here, Input and Output are dominant over Normal,
 * and breed accordingly.
 * @typedef {{INPUT, OUTPUT, NORMAL}} Types
 */

var Types = exports.Types = function (_Enum) {
    _inherits(Types, _Enum);

    function Types() {
        _classCallCheck(this, Types);

        return _possibleConstructorReturn(this, (Types.__proto__ || Object.getPrototypeOf(Types)).apply(this, arguments));
    }

    return Types;
}(_enumify.Enum);

Types.initEnum(['INPUT', 'NORMAL', 'OUTPUT']);

function randomType() {
    return (0, _evoHelpers.rndTrinary)(Types.NORMAL, Types.NORMAL, (0, _evoHelpers.rndBool)() ? Types.INPUT : Types.OUTPUT);
}

var Neuron = function () {
    /**
     * A trigger object. This describes a charge "triggering"
     * to be performed by the network.
     * @typedef {{
     *      offset:number,
     *      charge:number
     *  }} Trigger
     */

    /**
     * A buffer object. Describes a previous incoming charge.
     * @typedef {{charge:number, phase: number}} Charge
     */

    /**
     * Describes a connection to another neuron.
     * Offset describes the index offset between this neuron and its connection.
     * Offset, rather than hard "id's" are used to allow more organic growth.
     * If surrounding connections are augmented, through mutation, this allows the connections to flexibly match
     * the mutation. The resulting randomness betters selection based mutation.
     * @typedef {
     *      {
     *          offset: number
     *          filter: number
     *          probability: number
     *      }
     * } Connection
     */

    /**
     *
     * @param {number} threshold
     * @param {number} stability
     * @param {number} filter
     * @param {string} type
     * @param {Connection[]} connections
     */
    function Neuron(_ref) {
        var threshold = _ref.threshold,
            stability = _ref.stability,
            filter = _ref.filter,
            _ref$type = _ref.type,
            type = _ref$type === undefined ? Types.NORMAL : _ref$type,
            _ref$connections = _ref.connections,
            connections = _ref$connections === undefined ? [] : _ref$connections;

        _classCallCheck(this, Neuron);

        /**
         * A record of all incoming charges, and the phase they came in.
         * @type {Charge[]}
         */
        this.buffer = [];

        /**
         * The minimum buffer sum required to activate.
         * @type {number}
         */
        this.threshold = threshold;

        /** The value of incoming charge to pass on to connections.
         * @type {number}
         */
        this.filter = filter;
        /**
         * The number of phases for which a charge will be retained in buffer.
         * @type {number}
         */
        this.stability = stability;

        /**
         * The type of neuron, input, output, or normal.
         * This influences breeding.
         * @type {string}
         */
        this.type = type;

        /**
         * Connections for this neuron.
         * @type {Connection[]}
         */
        this.connections = connections;
    }

    /**
     * Given an incoming charge, compute all necessary outgoing charges.
     * @param {number} charge
     * @param {number} phase
     * @return {Trigger[]}
     */


    _createClass(Neuron, [{
        key: 'trigger',
        value: function trigger(charge, phase) {
            var _this2 = this;

            /**@type{Charge}*/
            var chargeObj = {
                charge: charge,
                phase: phase
            };
            var triggers = [];
            /**
             * Remove any items from history where
             * phase is older than stability.
             */
            this.cleanBuffer(phase);

            /**
             * Add this new charge to the buffer.
             */
            this.buffer.push(chargeObj);

            /**
             * If total charge > threshold,
             * iterate through connections.
             * For each one compute filtered charge, and return all pending triggers.
             */
            var summedCharge = this.sumBuffer();
            if (summedCharge > this.threshold) {
                this.connections.forEach(function (connection) {
                    if (Math.random() < connection.probability) {
                        triggers.push({
                            offset: connection.offset,
                            charge: summedCharge * _this2.filter * connection.filter
                        });
                    }
                });
            }

            return triggers;
        }

        /**
         * Remove any buffer items where phase is older than stability allows.
         * @param {number} phase
         */

    }, {
        key: 'cleanBuffer',
        value: function cleanBuffer(phase) {
            /**
             * Iterate through backwards. As new items add to end, this means
             * we will reach the "final too old" faster.
             */
            for (var i = this.buffer.length - 1; i >= 0; i--) {
                /**Find last occurance that is too old.*/
                if (this.buffer[i].phase < phase - this.stability) {
                    /**Set buffer = to only what is after this item.*/
                    this.buffer = this.buffer.slice(i + 1, this.buffer.length - 1);
                    break;
                }
            }
        }

        /** Find the total accumulated charge in the buffer.
         * @return {number}
         */

    }, {
        key: 'sumBuffer',
        value: function sumBuffer() {
            return this.buffer.reduce(function (sum, charge) {
                return sum + charge.charge;
            }, 0);
        }

        /**
         * Breed two neurons to return a third one, with mutations possible.
         * @param {Neuron} a
         * @param {Neuron} b
         * @return {Neuron}
         */

    }, {
        key: 'hasDominantType',


        /**
         * Returns whether the 'type' of this neuron is dominant.
         * Inputs and Output are dominant, normal is recessive.
         * @return {boolean}
         */
        value: function hasDominantType() {
            return this.type == Types.INPUT || this.type == Types.OUTPUT;
        }

        /**
         *
         * @param {Connection} conA
         * @param {Connection} conB
         * @return {Connection}
         */

    }], [{
        key: 'cross',
        value: function cross(a, b) {
            /**
             * Initialize properties for a hybrid neuron.
             * For each property, there is a 50% chance of a or b.
             * Init connections to an empty array though, that is seperate.
             */
            var c = {
                threshold: (0, _evoHelpers.rndTrinary)(a.threshold, b.threshold, Math.random()),
                stability: (0, _evoHelpers.rndTrinary)(a.stability, b.stability, Math.random()),
                filter: (0, _evoHelpers.rndTrinary)(a.filter, b.filter, Math.random()),
                type: undefined,
                connections: []
            };

            if (a.hasDominantType() == b.hasDominantType()) {
                c.type = (0, _evoHelpers.rndTrinary)(a.type, b.type, randomType());
            } else {
                var dominantType = a.hasDominantType() ? a.type : b.type;
                c.type = (0, _evoHelpers.rndTrinary)(dominantType, dominantType, randomType());
            }

            /**
             * Iterate through whichever list of connections is bigger, a or b.
             * This way, we'll be able to sequence every connection.
             */
            for (var i = 0; i < Math.max(a.connections.length, b.connections.length); i++) {
                /**
                 * Get the connections at this index in both neurons. This may be undefined in up to one neuron.
                 * @type {Connection} conA
                 * @type {Connection} conB
                 */
                var conA = a.connections[i];
                var conB = b.connections[i];

                /**
                 * If there is a connection element at this index for both a and b,
                 *      there is a 49% chance (each) of pushing conA or conB.
                 *      And a 2% chance of crossing.
                 */
                if (conA && conB) {

                    /**
                     * 99.5% chance of pushing either connection A, B, or a mutant thereof.
                     */
                    if (Math.random() < 0.995) {
                        c.connections.push((0, _evoHelpers.rndTrinary)(conA, conB, Neuron.crossConnections(conA, conB)));
                    } else {
                        /**
                         * .5% chance of pushing both connections A and B.
                         */
                        c.connections.push(conA, conB);
                    }
                } else if ((0, _evoHelpers.rndBool)()) {
                    /**
                     * If connections A and B don't both exist, 50% chance of pushing the existing one.
                     */
                    c.connections.push(conA || conB);
                }
            }
            return new Neuron(c);
        }
    }, {
        key: 'crossConnections',
        value: function crossConnections(conA, conB) {
            return {
                offset: (0, _evoHelpers.rndTrinary)(conA.offset, conB.offset, (Math.random() * 10 - Math.random() * 10).toFixed(0)),
                filter: (0, _evoHelpers.rndTrinary)(conA.filter, conB.filter, Math.random()),
                probability: (0, _evoHelpers.rndTrinary)(conA.probability, conB.probability, Math.random())
            };
        }
    }]);

    return Neuron;
}();

exports.default = Neuron;
//# sourceMappingURL=Neuron.js.map