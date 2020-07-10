/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");

    // Included so that we can diagram individual tracebacks in a debugger, as in:
    // console.log(fluid.test.diff.diagramTracebackAsText(testDef.leftValue, testDef.rightValue, tracebackTable));
    require("./lib/diagramTracebackTable");
};

jqUnit.module("Unit tests for 'longest common sequence' function...");

fluid.registerNamespace("fluid.test.diff.longestCommonSequence");
fluid.test.diff.longestCommonSequence.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.test.diff.longestCommonSequence.runSingleTest);
};

fluid.test.diff.longestCommonSequence.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = fluid.diff.longestCommonSequence(testDef.leftValue, testDef.rightValue, testDef.options);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.test.diff.generateMassiveMatch = function (index) {
    return { leftIndex: index, rightIndex: index };
};

fluid.defaults("fluid.test.diff.longestCommonSequence", {
    gradeNames: ["fluid.component"],
    // We want to compare to undefined values, so we need to avoid trying to expand or merge them.
    mergePolicy: {
        testDefs: "nomerge, noexpand"
    },
    testDefs: {
        // TODO: This fails in the browser, and only in the browser.  Discuss.
        // // Example from Wikipedia's entry on the subject: http://en.wikipedia.org/wiki/Longest_common_subsequence_problem
        // truthiness: {
        //     message:    "Our results should match the wikipedia entry...",
        //     leftValue:  ["G", "A", "C"],
        //     rightValue: ["A", "G", "C", "A", "T"],
        //     options: {
        //         lcsOptions: { timeout: 30000, tracebackStrategy: "full" }
        //     },
        //     expected:   [{ leftIndex: 0, rightIndex: 1}, { leftIndex: 1, rightIndex: 3}] // "GA"
        // },
        leadingDuplicate: {
            message:    "We should only hear about the first time a subsegment matches.",
            leftValue:  ["A", "B", "A"],
            rightValue: ["A"],
            expected:   [{ leftIndex: 0, rightIndex: 0}]
        },
        noMatch: {
            message:    "Arrays with no matches should be handled correctly...",
            leftValue:  [0, 1, 2],
            rightValue: [3, 4, 5],
            expected:   []
        },
        leadingMatch: {
            message:    "A leading match should be detected correctly...",
            leftValue:  [1],
            rightValue: [1, 2, 3],
            expected:   [{ leftIndex: 0, rightIndex: 0}]
        },
        trailingRightMatch: {
            message:    "A trailing sequence should be detected correctly...",
            leftValue:  [2],
            rightValue: [1, 2],
            expected:   [{ leftIndex: 0, rightIndex: 1 }]
        },
        intermediateMatch: {
            message:    "An intermediate contiguous match should be detected correctly...",
            leftValue:  [0, 1, 2, 3, 4],
            rightValue: [1, 2, 3],
            expected:   [{ leftIndex: 1, rightIndex: 0 }, { leftIndex: 2, rightIndex: 1 }, { leftIndex: 3, rightIndex: 2 }]
        },
        interleavedMatch: {
            message:    "An interleaved match should be detected correctly...",
            leftValue:  [1, 3, 5],
            rightValue: [1, 2, 3, 4, 5],
            expected:   [{ leftIndex: 0, rightIndex: 0 }, { leftIndex: 1, rightIndex: 2 }, { leftIndex: 2, rightIndex: 4 }]
        },
        fullMatch: {
            message:    "Two arrays that are equal should return all segments...",
            leftValue:  ["peas", "porridge", "hot"],
            rightValue: ["peas", "porridge", "hot"],
            expected:   [{ leftIndex: 0, rightIndex: 0 }, { leftIndex: 1, rightIndex: 1 }, { leftIndex: 2, rightIndex: 2 }]
        },
        objects: {
            message:    "We should be able to handle arrays of objects...",
            leftValue:  [{ foo: "bar"}, { baz: "qux"}],
            rightValue: [{ baz: "qux"}, { quux: "quuux"}],
            expected:   [{leftIndex:1, rightIndex: 0}]
        },
        undefinedRight: {
            message:    "We should be able to handle `undefined` as the right side of the comparison...",
            leftValue:  [],
            rightValue: undefined,
            expected:   []
        },
        undefinedLeft: {
            message:     "We should be able to handle `undefined` as the left side of the comparison...",
            leftValue:  [],
            rightValue: undefined,
            expected:   []
        },
        undefinedArrayValues: {
            message:    "We should be able to work with `undefined` array values...",
            leftValue:  [1, undefined, 0],
            rightValue: [2, undefined, 0],
            expected:   [{ leftIndex: 1, rightIndex: 1 }, { leftIndex: 2, rightIndex: 2}]
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.longestCommonSequence.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.longestCommonSequence();
