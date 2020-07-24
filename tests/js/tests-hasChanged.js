/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
fluid.logObjectRenderChars = 4096;

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");

    // Included so that we can diagram individual tracebacks in a debugger, as in:
    // console.log(fluid.test.diff.diagramTracebackTable(testDef.leftValue, testDef.rightValue, tracebackTable));
    require("./lib/diagramTracebackTable");
}

jqUnit.module("Unit tests for 'hasChanged' diff function...");

fluid.registerNamespace("fluid.test.diff.hasChanged");
fluid.test.diff.hasChanged.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.test.diff.hasChanged.runSingleTest);
};

fluid.test.diff.hasChanged.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var diff = fluid.diff.compare(testDef.leftValue, testDef.rightValue);
        var hasChanged = fluid.diff.hasChanged(diff);
        jqUnit.assertEquals("The results should be as expected.", testDef.expected, hasChanged);
    });
};

fluid.defaults("fluid.test.diff.hasChanged", {
    gradeNames: ["fluid.component"],
    // We have to do this so that we can specify "undefined" in our expected output, otherwise it is removed by the framework.
    mergePolicy: {
        testDefs: "noexpand, nomerge"
    },
    testDefs: {
        stringLeadingChange: {
            message:    "We should be able to detect changes at the beginning of a string.",
            leftValue:  "this",
            rightValue: "update this",
            expected:   true
        },
        stringIntermediateChange: {
            message:    "We should be able to detect changes in the middle of a string.",
            leftValue:  "this wasn't updated",
            rightValue: "this was updated",
            expected:   true
        },
        stringTrailingChange: {
            message:    "We should be able to detect changes at the end of a string.",
            leftValue:  ["A", "B"],
            rightValue: ["A", "B", "C"],
            expected:   true
        },
        arrayLeadingChange: {
            message:    "We should be able to detect changes at the beginning of an array.",
            leftValue:  ["B", "C"],
            rightValue: ["A", "B", "C"],
            expected:   true
        },
        arrayIntermediateChange: {
            message:    "We should be able to detect changes in the middle of an array.",
            leftValue:  ["A", "C"],
            rightValue: ["A", "B", "C"],
            expected:   true
        },
        arrayTrailingChange: {
            message:    "We should be able to detect changes at the end of an array.",
            leftValue:  ["A", "B"],
            rightValue: ["A", "B", "C"],
            expected:   true
        },
        numericChange: {
            message:    "We should be able to detect changes in numeric values.",
            leftValue:  1,
            rightValue: 2,
            expected:   true
        },
        booleanChange: {
            message:    "We should be able to detect changes in numeric values.",
            leftValue:  true,
            rightValue: false,
            expected:   true
        },
        changeToUndefined: {
            message:    "We should be able to detect a change in value to `undefined`.",
            leftValue:  "defined",
            rightValue: undefined,
            expected:   true
        },
        changeFromUndefined: {
            message:    "We should be able to detect a change in value to `undefined`.",
            leftValue:  undefined,
            rightValue: "defined",
            expected:   true
        },
        noChangeString: {
            message:    "We should be able to confirm that a string has not changed.",
            leftValue:  "The same string",
            rightValue: "The same string",
            expected:   false
        },
        noChangeNumber: {
            message:    "We should be able to confirm that a number has not changed.",
            leftValue:  Math.PI,
            rightValue: Math.PI,
            expected:   false
        },
        noChangeBoolean: {
            message:    "We should be able to confirm that a boolean has not changed.",
            leftValue:  true,
            rightValue: true,
            expected:   false
        },
        noChangeUndefined: {
            message:    "We should be able to confirm that a number has not changed.",
            leftValue:  undefined,
            rightValue: undefined,
            expected:   false
        },
        noChangeArray: {
            message:    "We should be able to confirm that an array has not changed.",
            leftValue:  [1, "foo", false, undefined],
            rightValue: [1, "foo", false, undefined],
            expected:   false
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.hasChanged.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.hasChanged();
