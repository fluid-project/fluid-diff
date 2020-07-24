/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    require("./testDefs-objectsEqual");
}

jqUnit.module("Unit tests for object equality function...");

fluid.registerNamespace("fluid.test.diff.objectsEqual");
fluid.test.diff.objectsEqual.runAllTests = function (that) {
    fluid.each(that.options.testDefs.objects, fluid.test.diff.objectsEqual.runSingleTest);
};

fluid.test.diff.objectsEqual.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                fluid.diff.objectsEqual(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = fluid.diff.objectsEqual(testDef.leftValue, testDef.rightValue);
            jqUnit.assertEquals("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("fluid.test.diff.objectsEqual", {
    gradeNames: ["fluid.test.diff.testDefs.objectsEqual"],
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.objectsEqual.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.objectsEqual();
