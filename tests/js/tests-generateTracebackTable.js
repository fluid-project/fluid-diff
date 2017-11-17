/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
fluid.logObjectRenderChars = 4096;

var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for 'single value' diff function...");

fluid.registerNamespace("gpii.test.diff.generateTracebackTable");
gpii.test.diff.generateTracebackTable.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.generateTracebackTable.runSingleTest);
};

gpii.test.diff.generateTracebackTable.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.generateTracebackTable(testDef.leftValue, testDef.rightValue);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });

};

fluid.defaults("gpii.test.diff.generateTracebackTable", {
    gradeNames: ["fluid.component"],
    // We have to do this so that we can specify "undefined" in our expected output, otherwise it is removed by the framework.
    mergePolicy: {
        testDefs: "noexpand, nomerge"
    },
    testDefs: {
        wikipedia: {
            message:    "We should be able to complete the example problem from Wikipedia.",
            leftValue:  ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            expected:   [
                // "G" Row
                [[{ fromLeft: false, fromAbove: false, matchLength: 0}], [{ fromLeft: false, fromAbove: false, matchLength: 1}], [{ fromLeft: true, fromAbove: false, matchLength: 1}], [{ fromLeft: true, fromAbove: false, matchLength: 1}],  [{ fromLeft: true, fromAbove: false, matchLength: 1}],  [{ fromLeft: true, fromAbove: false, matchLength: 1}]],
                // "A" Row
                [[{ fromLeft: false, fromAbove: false, matchLength: 1}], [{ fromLeft: true, fromAbove: true, matchLength: 1}],   [{ fromLeft: true, fromAbove: true, matchLength: 1}],  [{ fromLeft: true, fromAbove: true, matchLength: 1}],   [{ fromLeft: true, fromAbove: true, matchLength: 1}],   [{ fromLeft: true, fromAbove: true, matchLength: 1}]],
                // "C" Row
                [[{ fromLeft: false, fromAbove: true, matchLength: 1}],  [{ fromLeft: true, fromAbove: true, matchLength: 1}],   [{ fromLeft: true, fromAbove: true, matchLength: 2}],  [{ fromLeft: true, fromAbove: false, matchLength: 2}],  [{ fromLeft: true, fromAbove: false, matchLength: 2}],  [{ fromLeft: true, fromAbove: false, matchLength: 2}]]
            ]
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.generateTracebackTable.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.generateTracebackTable();
