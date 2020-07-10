/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%fluid-diff");

jqUnit.module("Unit tests for LCS calculateTightness function...");

fluid.registerNamespace("fluid.test.diff.calculateTightness");
fluid.test.diff.calculateTightness.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.test.diff.calculateTightness.runSingleTest);
};

fluid.test.diff.calculateTightness.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = fluid.diff.calculateTightness(testDef.input);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });

};

fluid.defaults("fluid.test.diff.calculateTightness", {
    gradeNames: ["fluid.component"],
    // We have to do this so that we can specify "undefined" in our expected output, otherwise it is removed by the framework.
    mergePolicy: {
        testDefs: "noexpand, nomerge"
    },
    testDefs: {
        adjacent: {
            message:  "Adjacent cells should have a tightness of zero...",
            input:    [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}],
            expected: 0
        },
        leftGap: {
            message:  "A one-segment gap on the left side should be handled correctly...",
            input:    [{leftIndex:0, rightIndex: 0}, { leftIndex: 2, rightIndex: 1}],
            expected: 0.5
        },
        rightGap: {
            message:  "A one-segment gap on the right side should be handled correctly...",
            input:    [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 2}],
            expected: 0.5
        },
        bothGap: {
            message:  "A one-segment gap on both sides should be handled correctly...",
            input:    [{leftIndex:0, rightIndex: 0}, { leftIndex: 2, rightIndex: 2}],
            expected: 1
        },
        laterAdjacent: {
            message: "An adjacent set of cells with higher indexes should still have a tightness of zero...",
            input:    [{leftIndex:22, rightIndex: 22}, { leftIndex: 23, rightIndex: 23}],
            expected: 0
        },
        laterGap: {
            message: "An gap in a set of cells with higher indexes should be handled correctly...",
            input:    [{leftIndex:12, rightIndex: 23}, { leftIndex: 14, rightIndex: 25}],
            expected: 1
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.calculateTightness.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.calculateTightness();
