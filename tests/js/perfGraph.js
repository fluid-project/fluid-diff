/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-diff");

fluid.registerNamespace("gpii.tests.diff.performance");

// Generate test data like 0 1 2 3 4 5 6, etc.
gpii.tests.diff.performance.generateIndexArray = function (index) {
    return index;
};

// Generate test data like 0 2 2 4 4 6 6, etc.
gpii.tests.diff.performance.generateEvenArray = function (index) {
    return index + (index % 2 ? 1 : 0);
};

for (var a = 1; a < 50; a++) {
    var leftArray = fluid.generate(a, gpii.tests.diff.performance.generateIndexArray, true);
    var rightArray = fluid.generate(a, gpii.tests.diff.performance.generateEvenArray, true);
    var start = Date.now();
    var diff = gpii.diff.compareArrays(leftArray, rightArray);
    var end = Date.now();
    console.log(a + "," + (end - start) + "," + diff.length);
}
