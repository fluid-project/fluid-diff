/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for string diff function...");

fluid.registerNamespace("gpii.test.diff.objectsEqual");
gpii.test.diff.objectsEqual.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.objectsEqual.runSingleTest);
};

gpii.test.diff.objectsEqual.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                gpii.diff.objectsEqual(testDef.objectOne, testDef.objectTwo);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = gpii.diff.objectsEqual(testDef.objectOne, testDef.objectTwo);
            jqUnit.assertEquals("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("gpii.test.diff.objectsEqual", {
    gradeNames: ["fluid.component"],
    testDefs: {
        unequalKeyLength: {
            message:   "Objects with a different number of keys should not be equal...",
            objectOne: { foo: "bar", baz: "quuux"},
            objectTwo: { foo: "bar"},
            expected:  false
        },
        unequalWithEqualKeyLength: {
            message:  "Unequal objects with the same number of keys should not be equal...",
            objectOne: { foo: "bar", baz: "qux"},
            objectTwo: { foo: "bar", qux: "quux"},
            expected:  false
        },
        emptyObjects: {
            message:  "Two empty objects should be equal...",
            objectOne: {},
            objectTwo: {},
            expected:  true
        },
        equalObjects: {
            message:  "Equal objects should be equal...",
            objectOne: { foo: "bar", baz: { qux: "quuux"} },
            objectTwo: { foo: "bar", baz: { qux: "quuux"} },
            expected:  true
        },
        arrayValuesEqual: {
            message:  "Objects containing equal arrays should be equal...",
            objectOne: { foo: [1] },
            objectTwo: { foo: [1] },
            expected:  true
        },
        arrayValuesUnequal: {
            message:  "Objects containing unequal arrays should be unequal...",
            objectOne: { foo: [0] },
            objectTwo: { foo: [1] },
            expected:  false
        },
        unEqualShallow: {
            message:  "Shallow inequalities should be handled correctly...",
            objectOne: { foo: 0 },
            objectTwo: { foo: 1 },
            expected:  false
        },
        unEqualDeep: {
            message:  "Deep inequalities should be handled correctly...",
            objectOne: { foo: { bar: { baz: 0 } } },
            objectTwo: { foo: { bar: { baz: 1 } } },
            expected:  false
        },
        undefinedShalllowUnequal: {
            message:  "Shallow undefined values should be handled correctly...",
            objectOne: {},
            objectTwo: undefined,
            expected:  false
        },
        undefinedDeepUnequal: {
            message:  "Deep undefined values should be handled correctly...",
            objectOne: { foo: {} },
            objectTwo: { foo: undefined },
            expected:  false
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.objectsEqual.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.objectsEqual();
