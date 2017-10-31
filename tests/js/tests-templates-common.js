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
        var html = renderer.render("diff", testDef.input);
        jqUnit.assertEquals("The HTML output should have been as expected...", testDef.expectedHtml, html);

        var text = renderer.render("diff-text", testDef.input);
        jqUnit.assertEquals("The text output should have been as expected...", testDef.expectedText, text);
    });
};

fluid.defaults("gpii.tests.diff.templates.common", {
    gradeNames: ["fluid.component"],
    testDefs: {
        noChange: {
            message:      "We should be able to handle a string that has not changed.",
            input:        [{ value: "This has not changed.", type: "unchanged"}],
            expectedHtml: "This has not changed.\n",
            expectedText: "This has not changed.\n"
        },
        justAdded: {
            message:      "We should be able to handle content that has been entirely added.",
            input:        [{ value: "Added.", type: "added"}],
            expectedHtml: "<ins><span class=\"gpii-diff-announcement\">Content added:</span>Added.<span class=\"gpii-diff-announcement\">End added content.</span></ins>\n",
            expectedText: "+Added.+\n"
        },
        justDeleted: {
            message:      "We should be able to handle content that has been completely removed.",
            input:        [{ value: "Deleted.", type: "removed"}],
            expectedHtml: "<del><span class=\"gpii-diff-announcement\">Content deleted:</span>Deleted.<span class=\"gpii-diff-announcement\">End deleted content.</span></del>\n",
            expectedText: "-Deleted.-\n"
        },
        replaced: {
            message:      "We should be able to handle content that has been replaced.",
            input:        [{ value: "foo", type: "removed"}, { value: "bar", type: "added"}],
            expectedHtml: "<del><span class=\"gpii-diff-announcement\">Content deleted:</span>foo<span class=\"gpii-diff-announcement\">End deleted content.</span></del><ins><span class=\"gpii-diff-announcement\">Content added:</span>bar<span class=\"gpii-diff-announcement\">End added content.</span></ins>\n",
            expectedText: "-foo-+bar+\n"
        },
        arrayContent: {
            message:      "We should be able to handle array content.",
            input:        [{ arrayValue: ["old"], type: "removed"}, { arrayValue: ["new"], type: "added"}],
            expectedHtml:  "<ul>\n    <li class=\"diff-removed\"><del><span class=\"gpii-diff-announcement\">Content deleted:</span>old<span class=\"gpii-diff-announcement\">End deleted content.</span></del></li>\n    <li class=\"diff-added\"><ins><span class=\"gpii-diff-announcement\">Content added:</span>new<span class=\"gpii-diff-announcement\">End added content.</span></ins></li>\n</ul>\n",
            expectedText: "* -old-\n* +new+\n"
        },
        normalArray: {
            message:      "A normal (non-diff) array should not result in rendered output...",
            input:        [ 0, 1, 2],
            expectedHtml: "\n",
            expectedText: "\n"
        },
        emptyArray: {
            message:      "An empty array should not result in rendered output...",
            input:        [],
            expectedHtml: "\n",
            expectedText: "\n"
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
                    "onTemplatesLoaded.runTests": {
                        funcName: "gpii.tests.diff.templates.runAllTests",
                        args:     ["{gpii.tests.diff.templates.node}.options.testDefs", "{that}"]
                    }
                },
                components: {
                    isDiffArray: {
                        type: "gpii.diff.helper.isDiffArray"
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.diff.templates.browser", {
    gradeNames: ["gpii.tests.diff.templates.common"],
    components: {
        rendererer: {
            type: "gpii.handlebars.renderer.serverAware",
            options: {
                templateUrl: "http://localhost:7015/hbs",
                listeners: {
                    "onTemplatesLoaded.runTests": {
                        funcName: "gpii.tests.diff.templates.runAllTests",
                        args:     ["{gpii.tests.diff.templates.browser}.options.testDefs", "{that}"]
                    }
                },
                components: {
                    isDiffArray: {
                        type: "gpii.diff.helper.isDiffArray"
                    }
                }

            }
        }
    }
});
