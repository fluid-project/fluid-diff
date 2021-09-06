/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
fluid.logObjectRenderChars = 4098 * 1024;

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    require("./testDefs-compareArrays");
}

jqUnit.module("Unit tests for array diff function.");


fluid.registerNamespace("fluid.test.diff.compareArrays");
fluid.test.diff.compareArrays.runAllTests = function (that) {
    fluid.each(that.options.testDefs.arrays, fluid.test.diff.compareArrays.runSingleTest);
};

fluid.test.diff.compareArrays.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                fluid.diff.compareArrays(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = fluid.diff.compareArrays(testDef.leftValue, testDef.rightValue);
            jqUnit.assertDeepEq("The results should be as expected.", testDef.expected, result);
        }
    });
};

fluid.defaults("fluid.test.diff.compareArrays", {
    gradeNames: ["fluid.test.diff.testDefs.compareArrays"],
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.compareArrays.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.compareArrays();
