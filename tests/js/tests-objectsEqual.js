/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    require("./testDefs-objectsEqual");
}

jqUnit.module("Unit tests for object equality function...");

fluid.registerNamespace("gpii.test.diff.objectsEqual");
gpii.test.diff.objectsEqual.runAllTests = function (that) {
    fluid.each(that.options.testDefs.objects, gpii.test.diff.objectsEqual.runSingleTest);
};

gpii.test.diff.objectsEqual.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                gpii.diff.objectsEqual(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = gpii.diff.objectsEqual(testDef.leftValue, testDef.rightValue);
            jqUnit.assertEquals("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("gpii.test.diff.objectsEqual", {
    gradeNames: ["gpii.test.diff.testDefs.objectsEqual"],
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.objectsEqual.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.objectsEqual();
