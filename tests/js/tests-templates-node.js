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
