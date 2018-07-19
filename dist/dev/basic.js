'use strict';

var _Neuron = require('../Neuron');

var _Neuron2 = _interopRequireDefault(_Neuron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var n1 = new _Neuron2.default({
    threshold: 0.1,
    filter: 0.1,
    stability: 0.1,
    connections: [{
        offset: 1,
        probability: 1,
        filter: 1
    }, {
        offset: 3,
        probability: 1,
        filter: 1
    }]

});
var n2 = new _Neuron2.default({
    threshold: 0.2,
    filter: 0.2,
    stability: 0.2,
    connections: [{
        offset: 2,
        probability: 1,
        filter: 1
    }]
});

console.dir(n1);
console.dir(n2);

/**
 * Test of how often "double connection" mutations occur. As expected, ~0.5%.
 */
console.dir('cross');
var dmuts = 0;
var max = 1000;
for (var i = 0; i < max; i++) {
    var c = _Neuron2.default.cross(n1, n2);
    if (c.connections.length > 2) {
        console.dir(i);
        console.dir(c);
        dmuts += 1;
    }
}

console.dir(dmuts);
console.dir(dmuts / max);

/**
 * Test of trigger
 */
// console.dir('trigger');
// console.dir(n.trigger(1,1));
//# sourceMappingURL=basic.js.map