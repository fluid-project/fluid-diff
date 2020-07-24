/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
fluid.setLogging(true);

fluid.require("%fluid-diff");


// With the "single path" approach, this scales to the point where it's safe to increment by hundreds.
for (var a = 1; a < 60; a += 1) {
    var leftArray = fluid.generate(a, fluid.tests.diff.performance.generateIndexArray, true);
    var rightArray = fluid.generate(a, fluid.tests.diff.performance.generateEvenArray, true);
    var start = Date.now();
    var diff = fluid.diff.compareArrays(leftArray, rightArray, { tracebackStrategy: "full", timeout: 1000});
    var end = Date.now();
    fluid.log(a + "," + (end - start) + "," + diff.length);
}
