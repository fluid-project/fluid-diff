/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("gpii.test.diff.testDefs.compareMarkdown", {
    gradeNames: ["fluid.component"],
    // We need to preserve `undefined` values in our comparisons.
    mergePolicy: {
        "testDefs.markdown": "nomerge, noexpand"
    },
    testDefs: {
        markdown: {
            htmlChangeWithinTags: {
                message:    "Changes within tags should be handled correctly...",
                leftValue:  "<b>This is bold</b>",
                rightValue: "<b>This is no less bold</b>",
                expected:   [{value: "This is ", type: "unchanged"}, { value: "no less ", type: "added"}, { value: "bold", type: "unchanged"}]
            },
            htmlTagsChanged: {
                message:    "Changes to only HTML tags should not be reported as changes...",
                leftValue:  "<b>This is a fine sentence.</b>",
                rightValue: "<i>This is a fine sentence.</i>",
                expected:   [{value: "This is a fine sentence.", type: "unchanged"}]
            },
            htmlRemoved: {
                message:    "HTML tags that are removed should not be reported as changes...",
                leftValue:  "This is <b>bold</b>",
                rightValue: "This is bold",
                expected:   [{value: "This is bold", type: "unchanged"}]
            },
            htmlAdded: {
                message:    "HTML tags that are added should not be reported as changes...",
                leftValue:  "This is bold",
                rightValue: "This is <b>bold</b>",
                expected:   [{value: "This is bold", type: "unchanged"}]
            },
            markdownChangeWithinMarkdown: {
                message:    "Changes to the markdown but not the text should not be reported as changes...",
                leftValue:  "*emphasis*",
                rightValue: "_emphasis_",
                expected:   [{ value: "emphasis", type: "unchanged" }]
            },
            markdownChanged: {
                message:    "Text changes within Markdown should be reported correctly...",
                leftValue:  "**This is bold**",
                rightValue: "*This is italic*",
                expected:   [{ value: "This is ", type: "unchanged" }, {value: "bold", type: "removed" }, { value: "italic", type: "added" }]
            },
            markdownAdded: {
                message:    "Markdown that is added should not be reported as a change...",
                leftValue:  "This is strong.",
                rightValue: "This is *strong*.",
                expected:   [{ value: "This is strong.", type: "unchanged"}]
            },
            markdownRemoved: {
                message:    "Markdown that is removed should not be reported as a change...",
                leftValue:  "This is *strong*.",
                rightValue: "This is strong.",
                expected:   [{ value: "This is strong.", type: "unchanged"}]
            },
            nonStringLeft: {
                message:    "We should be able to handle non-strings on the left side of the comparison...",
                leftValue:  1,
                rightValue: "string value",
                expected:   [{ value: 1, type: "removed"}, { value: "string value", type: "added"}]
            },
            nonStringRight: {
                message:    "We should be able to handle non-strings on the left side of the comparison...",
                leftValue:  "string value",
                rightValue: 1,
                expected:   [{ value: "string value", type: "removed" }, { value: 1, type: "added" }]
            },
            bothNonStrings: {
                message:    "We should be able to handle non-strings on both sides of the comparison...",
                leftValue:  true,
                rightValue: -1,
                expected:   [{ value: true, type: "removed" }, { value: -1, type: "added" }]
            },
            // real example from the UL
            complexHtml: {
                message:    "We should be able to handle HTML tables...",
                leftValue:  "<table border='0'><tr><td colspan='3'>The following specifications may only comply to some variants.</td></tr><tr><td colspan='3'><strong>Intended/suitable for one-hand operation</strong></td></tr><tr><td colspan='3'><strong>Left-hand keyboard</strong></td></tr><tr><td colspan='3'><strong>Wireless</strong></td></tr></table>",
                rightValue: "<table border='0'><tr><td colspan='3'>The following specifications may only apply to some variants.</td></tr><tr><td colspan='3'><strong>Intended/suitable for one-hand operation</strong></td></tr><tr><td colspan='3'><strong>Left-hand keyboard</strong></td></tr><tr><td colspan='3'><strong>Wireless</strong></td></tr></table>",
                expected:   [
                    {
                        "value": "The following specifications may only ",
                        "type": "unchanged"
                    },
                    {
                        "value": "comply",
                        "type": "removed"
                    },
                    {
                        "value": "apply",
                        "type": "added"
                    },
                    {
                        "value": " to some variants.Intended/suitable for one-hand operationLeft-hand keyboardWireless",
                        "type": "unchanged"
                    }
                ]
            }
        }
    }
});
