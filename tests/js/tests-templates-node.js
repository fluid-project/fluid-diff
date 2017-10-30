/*

    A common suite of tests for both the HTML and text templates in this package.

 */
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-handlebars");

require("./tests-templates-common");

gpii.tests.diff.templates.node();

fluid.defaults("gpii.tests.diff.templates.browser", {
    gradeNames: ["gpii.tests.diff.templates.common"],
    components: {
        rendererer: {
            type: "gpii.handlebars.serverAware",
            options: {
                templateUrl: "/hbs",
                listeners: {
                    "onTemplatesLoaded.runTests": {
                        funcName: "gpii.tests.diff.templates.runAllTests",
                        args:     ["{gpii.tests.diff.templates.browser}.options.testDefs", "{renderer}"]
                    }
                }
            }
        }
    }
});
