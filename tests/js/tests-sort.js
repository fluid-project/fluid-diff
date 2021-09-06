/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%fluid-diff");

jqUnit.module("Unit tests for LCS sort function.");

fluid.registerNamespace("fluid.test.diff.sort");
fluid.test.diff.sort.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.test.diff.sort.runSingleTest);
};

fluid.test.diff.sort.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = fluid.copy(testDef.input).sort(fluid.diff.sortByLengthThenTightnessThenIndex);
        jqUnit.assertDeepEq("The results should be as expected.", testDef.expected, result);
    });

};

fluid.defaults("fluid.test.diff.sort", {
    gradeNames: ["fluid.component"],
    // We have to do this so that we can specify "undefined" in our expected output, otherwise it is removed by the framework.
    mergePolicy: {
        testDefs: "noexpand, nomerge"
    },
    testDefs: {
        longest: {
            message:  "The longest match should win.",
            input:    [
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}],
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}, { leftIndex: 2, rightIndex: 2}, { leftIndex: 3, rightIndex: 3}],
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}, { leftIndex: 2, rightIndex: 2}]
            ],
            expected: [
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}, { leftIndex: 2, rightIndex: 2}, { leftIndex: 3, rightIndex: 3}],
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}, { leftIndex: 2, rightIndex: 2}],
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}]
            ]
        },
        tightest: {
            message:  "If both are equally long, the 'tightest' match should win.",
            input:    [
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}],
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 2, rightIndex: 2}]
            ],
            expected: [
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}],
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 2, rightIndex: 2}]
            ]
        },
        earliest: {
            message:  "If both are equally long and equally tight, the earliest match should win.",
            input:    [
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}],
                [{leftIndex:1, rightIndex: 1}, { leftIndex: 2, rightIndex: 2}]
            ],
            expected: [
                [{leftIndex:0, rightIndex: 0}, { leftIndex: 1, rightIndex: 1}],
                [{leftIndex:1, rightIndex: 1}, { leftIndex: 2, rightIndex: 2}]
            ]
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.sort.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.sort();
