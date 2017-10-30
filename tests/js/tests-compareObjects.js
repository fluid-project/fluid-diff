/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    require("./testDefs-compareObjects");
}

jqUnit.module("Unit tests for object diff function...");

fluid.registerNamespace("gpii.test.diff.compareObjects");
gpii.test.diff.compareObjects.runAllTests = function (that) {
    fluid.each(that.options.testDefs.objects, gpii.test.diff.compareObjects.runSingleTest);
};

gpii.test.diff.compareObjects.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.compareObjects(testDef.leftValue, testDef.rightValue);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.compareObjects", {
    gradeNames: ["gpii.test.diff.testDefs.compareObjects"],
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.compareObjects.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.compareObjects();
