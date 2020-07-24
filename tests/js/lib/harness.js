/*

    A test harness to set the server-side usage of our templates and helper.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-express");
fluid.require("%fluid-handlebars");
fluid.require("%fluid-diff");

var stringPayload = fluid.diff.compare("A string with no edits.", "An updated string with some minor edits.");
var arrayPayload  = fluid.diff.compare(["bacon", "lettuce", "tomato"], ["chicken", "avocado", "lettuce", "tomato"]);

fluid.defaults("fluid.tests.diff.harness", {
    gradeNames:  ["fluid.testem.coverage.express", "fluid.express"],
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{that}.options.port"}]
        }
    },
    templateDirs: ["%fluid-diff/tests/templates", "%fluid-diff/src/templates"],
    components: {
        corsHeaders: {
            type: "fluid.express.middleware.headerSetter",
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
            type: "fluid.express.hb",
            options: {
                templateDirs: "{harness}.options.templateDirs",
                components: {
                    renderer: {
                        options: {
                            components: {
                                isDiffArray: {
                                    type: "fluid.diff.helper.isDiffArray"
                                },
                                hasChanged: {
                                    type: "fluid.diff.helper.hasChanged"
                                },
                                leftValue: {
                                    type: "fluid.diff.helper.leftValue"
                                },
                                rightValue: {
                                    type: "fluid.diff.helper.rightValue"
                                }
                            }
                        }
                    }
                }
            }
        },
        dispatcher: {
            type: "fluid.handlebars.dispatcherMiddleware",
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
            type: "fluid.handlebars.inlineTemplateBundlingMiddleware",
            options: {
                path: "/hbs",
                templateDirs: "{harness}.options.templateDirs"
            }
        }
    }
});
