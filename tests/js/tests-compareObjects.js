/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    fluid.diff.loadMarkdownSupport();

    require("./testDefs-compareObjects");
}

jqUnit.module("Unit tests for object diff function.");

fluid.registerNamespace("fluid.test.diff.compareObjects");
fluid.test.diff.compareObjects.runAllTests = function (that) {
    fluid.each(that.options.testDefs.objects, fluid.test.diff.compareObjects.runSingleTest);
};

fluid.test.diff.compareObjects.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = fluid.diff.compareObjects(testDef.leftValue, testDef.rightValue, testDef.options);
        jqUnit.assertDeepEq("The results should be as expected.", testDef.expected, result);
    });
};

fluid.defaults("fluid.test.diff.compareObjects", {
    gradeNames: ["fluid.test.diff.testDefs.compareObjects"],
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.compareObjects.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.compareObjects();
