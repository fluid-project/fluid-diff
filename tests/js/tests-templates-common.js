/*

    A common suite of tests for both the HTML and text templates in this package.

 */
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

fluid.registerNamespace("gpii.tests.diff.templates");

gpii.tests.diff.templates.runAllTests = function (testDefs, renderer) {
    fluid.each(testDefs, function (testDef) {
        gpii.tests.diff.templates.runSingleTest(testDef, renderer);
    });
};

gpii.tests.diff.templates.runSingleTest = function (testDef, renderer) {
    jqUnit.test(testDef.message, function () {
        var html = renderer.render(testDef.htmlTemplateKey || "diff-wrapped", testDef.input);
        jqUnit.assertEquals("The HTML output should have been as expected.", testDef.expectedHtml, html);

        if (testDef.textTemplateKey) {
            var text = renderer.render(testDef.textTemplateKey || "diff-text-wrapped", testDef.input);
            jqUnit.assertEquals("The text output should have been as expected.", testDef.expectedText, text);
        }
    });
};

fluid.defaults("gpii.tests.diff.templates.common", {
    gradeNames: ["fluid.component"],
    testDefs: {
        noChange: {
            message:      "We should be able to handle a string that has not changed.",
            input:        { toCheck: [{ value: "This has not changed.", type: "unchanged"}] },
            expectedHtml: "This has not changed.\n",
            expectedText: "This has not changed.\n"
        },
        justAdded: {
            message:      "We should be able to handle content that has been entirely added.",
            input:        { toCheck: [{ value: "Added.", type: "added"}] },
            expectedHtml: "<ins><img class=\"gpii-diff-zeropx\" aria-label=\"Begin inserted content.\"/>Added.<img class=\"gpii-diff-zeropx\" aria-label=\"End inserted content.\"/></ins>\n",
            expectedText: "+Added.+\n"
        },
        justDeleted: {
            message:      "We should be able to handle content that has been completely removed.",
            input:        { toCheck: [{ value: "Deleted.", type: "removed"}] },
            expectedHtml: "<del><img class=\"gpii-diff-zeropx\" aria-label=\"Begin deleted content.\"/>Deleted.<img class=\"gpii-diff-zeropx\" aria-label=\"End deleted content.\"/></del>\n",
            expectedText: "-Deleted.-\n"
        },
        replaced: {
            message:      "We should be able to handle content that has been replaced.",
            input:        { toCheck: [{ value: "foo", type: "removed"}, { value: "bar", type: "added"}] },
            expectedHtml: "<del><img class=\"gpii-diff-zeropx\" aria-label=\"Begin deleted content.\"/>foo<img class=\"gpii-diff-zeropx\" aria-label=\"End deleted content.\"/></del><ins><img class=\"gpii-diff-zeropx\" aria-label=\"Begin inserted content.\"/>bar<img class=\"gpii-diff-zeropx\" aria-label=\"End inserted content.\"/></ins>\n",
            expectedText: "-foo-+bar+\n"
        },
        arrayContent: {
            message:      "We should be able to handle array content.",
            input:        { toCheck: [{ arrayValue: ["old"], type: "removed"}, { arrayValue: ["new"], type: "added"}] },
            expectedHtml:  "<ul>\n    <li class=\"diff-removed\"><del><img class=\"gpii-diff-zeropx\" aria-label=\"Begin deleted content.\"/>old<img class=\"gpii-diff-zeropx\" aria-label=\"End deleted content.\"/></del></li>\n    <li class=\"diff-added\"><ins><img class=\"gpii-diff-zeropx\" aria-label=\"Begin inserted content.\"/>new<img class=\"gpii-diff-zeropx\" aria-label=\"End inserted content.\"/></ins></li>\n</ul>\n",
            expectedText: "* -old-\n* +new+\n"
        },
        normalArray: {
            message:      "A normal (non-diff) array should not result in rendered output.",
            input:        { toCheck: [ 0, 1, 2] },
            expectedHtml: "\n",
            expectedText: "\n"
        },
        emptyArray: {
            message:      "An empty array should not result in rendered output.",
            input:        { toCheck: [] },
            expectedHtml: "\n",
            expectedText: "\n"
        },
        hasChanged: {
            message:         "The hasChanged helper should be able to detect a change.",
            input:           { toCheck: [{value: "foo", "type":  "removed"}, { value: "bar", type: "added"}] },
            htmlTemplateKey: "hasChanged",
            expectedHtml:    "true",
            textTemplateKey: false
        },
        hasNotChanged: {
            message:         "The hasChanged helper should be able to detect when there has not been a change.",
            input:           { toCheck: [{value: "foo", "type":  "unchanged"}] },
            htmlTemplateKey: "hasChanged",
            expectedHtml:    "false",
            textTemplateKey: false
        },
        leftValue: {
            message:         "The leftValue helper should be able to output the left side of a change.",
            input:           { toCheck: [{value: "foo", "type":  "removed"}, { value: "bar", type: "added"}] },
            htmlTemplateKey: "leftValue",
            expectedHtml:    "foo",
            textTemplateKey: false
        },
        rightValue: {
            message:         "The rightValue helper should be able to output the right side of a change.",
            input:           { toCheck: [{value: "foo", "type":  "removed"}, { value: "bar", type: "added"}] },
            htmlTemplateKey: "rightValue",
            expectedHtml:    "bar",
            textTemplateKey: false
        }
    }
});

fluid.defaults("gpii.tests.diff.templates.node", {
    gradeNames: ["gpii.tests.diff.templates.common"],
    components: {
        rendererer: {
            type: "gpii.handlebars.standaloneRenderer",
            options: {
                templateDirs: ["%gpii-diff/tests/templates", "%gpii-diff/src/templates"],
                listeners: {
                    "onCreate.runTests": {
                        funcName: "gpii.tests.diff.templates.runAllTests",
                        args:     ["{gpii.tests.diff.templates.node}.options.testDefs", "{that}"]
                    }
                },
                components: {
                    isDiffArray: {
                        type: "gpii.diff.helper.isDiffArray"
                    },
                    hasChanged: {
                        type: "gpii.diff.helper.hasChanged"
                    },
                    leftValue: {
                        type: "gpii.diff.helper.leftValue"
                    },
                    rightValue: {
                        type: "gpii.diff.helper.rightValue"
                    }
                }
            }
        }
    }
});
