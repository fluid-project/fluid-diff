/*

    A test harness to set the server-side usage of our templates and helper.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-express");
fluid.require("%gpii-handlebars");
fluid.require("%gpii-diff");

var stringPayload = gpii.diff.compare("A string with no edits.", "An updated string with some minor edits.");
var arrayPayload  = gpii.diff.compare(["bacon", "lettuce", "tomato"], ["chicken", "avocado", "lettuce", "tomato"]);

fluid.defaults("gpii.tests.diff.harness", {
    gradeNames:  ["gpii.testem.coverage.express", "gpii.express"],
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{that}.options.port"}]
        }
    },
    templateDirs: ["%gpii-diff/tests/templates", "%gpii-diff/src/templates"],
    components: {
        corsHeaders: {
            type: "gpii.express.middleware.headerSetter",
            options: {
                priority: "first",
                headers: {
                    cors: {
                        fieldName: "Access-Control-Allow-Origin",
                        template:  "*",
                        dataRules: {}
                    }
                }
            }
        },
        handlebars: {
            type: "gpii.express.hb",
            options: {
                templateDirs: "{harness}.options.templateDirs",
                components: {
                    renderer: {
                        options: {
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
            }
        },
        dispatcher: {
            type: "gpii.handlebars.dispatcherMiddleware",
            options: {
                priority: "after:handlebars",
                path: ["/dispatcher/:template", "/dispatcher"],
                templateDirs: "{harness}.options.templateDirs",
                rules: {
                    contextToExpose: {
                        stringDiff: { literalValue: stringPayload },
                        arrayDiff:  { literalValue: arrayPayload  }
                    }
                }
            }
        },
        inline: {
            type: "gpii.handlebars.inlineTemplateBundlingMiddleware",
            options: {
                path: "/hbs",
                templateDirs: "{harness}.options.templateDirs"
            }
        }
    }
});
