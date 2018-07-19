"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rndBool = rndBool;
exports.rndTrinary = rndTrinary;
function rndBool() {
    return Math.random() >= 0.5;
}

function rndTrinary(o1, o2, o3) {
    var rnd = Math.random();

    if (rnd < 0.49) {
        return o1;
    } else if (rnd < 0.98) {
        return o2;
    } else {
        return o3;
    }
}
//# sourceMappingURL=evoHelpers.js.map