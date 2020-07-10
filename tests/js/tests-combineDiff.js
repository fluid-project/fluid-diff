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

jqUnit.module("Unit tests for 'combineDiff' functions...");

fluid.registerNamespace("fluid.test.diff.hasChanged");
fluid.test.diff.hasChanged.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.test.diff.hasChanged.runSingleTest);
};

fluid.test.diff.hasChanged.runSingleTest = function (testDef) {
    var compareFn = testDef.isArray ? "assertDeepEq" : "assertEquals";
    jqUnit.test(testDef.message, function () {
        var diff = fluid.diff.compare(testDef.leftValue, testDef.rightValue);

        var leftValue = fluid.diff.leftValue(diff);
        jqUnit[compareFn]("The left value should be as expected.", testDef.leftValue, leftValue);

        var rightValue = fluid.diff.rightValue(diff);
        jqUnit[compareFn]("The right value should be as expected.", testDef.rightValue, rightValue);
    });
};

fluid.defaults("fluid.test.diff.hasChanged", {
    gradeNames: ["fluid.component"],
    // We have to do this so that we can specify "undefined" in our expected output, otherwise it is removed by the framework.
    mergePolicy: {
        testDefs: "noexpand, nomerge"
    },
    testDefs: {
        stringChanged: {
            message:    "We should be able to reconstruct changes to a string.",
            leftValue:  "Original string.",
            rightValue: "Updated string"
        },
        stringUnchanged: {
            message:    "We should be able to handle a string that has not changed.",
            leftValue:  "Unchanged string.",
            rightValue: "Unchanged string."
        },
        numberChanged: {
            message:    "We should be able to reconstruct changes to a number.",
            leftValue:  5,
            rightValue: 6
        },
        numberUnchanged: {
            message:    "We should be able to handle a numer that has not changed.",
            leftValue:  7,
            rightValue: 7
        },
        booleanChanged: {
            message:    "We should be able to reconstruct changes to a boolean value.",
            leftValue:  true,
            rightValue: false
        },
        booleanUnchanged: {
            message:    "We should be able to handle a boolean value that has not changed.",
            leftValue:  false,
            rightValue: false
        },
        arrayChanged: {
            message:    "We should be able to reconstruct changes to an array.",
            leftValue:  [0, 1, 2],
            rightValue: [1, 2, 3],
            isArray:    true
        },
        arrayUnchanged: {
            message:    "We should be able to handle a numer that has not changed.",
            leftValue:  ["peas", 0, true, undefined],
            rightValue: ["peas", 0, true, undefined],
            isArray:    true
        },
        changedToUndefined: {
            message:    "We should be able to reconstruct change from a value to undefined.",
            leftValue:  5,
            rightValue: undefined
        },
        changedFromUndefined: {
            message:    "We should be able to reconstruct a change from undefined to a value.",
            leftValue:  undefined,
            rightValue: 6
        },
        undefinedUnchanged: {
            message:    "We should be able to handle a case in which both sides are undefined.",
            leftValue:  undefined,
            rightValue: undefined
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
