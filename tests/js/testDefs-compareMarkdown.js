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
            htmlAddedd: {
                message:    "HTML tags that are added should not be reported as changes...",
                leftValue:  "This is bold",
                rightValue: "This is <b>bold</b>",
                expected:   [{value: "This is bold", type: "unchanged"}]
            },
            markdownChangeWithinMarkdown: {
                message:    "Changes to the markdown but not the text should not be reported as changes...",
                leftValue:  "*emphasis*",
                rightValue: "_emphasis_",
                expected:   [{value: "emphasis", type: "unchanged"}]
            },
            markdownChanged: {
                message:    "Text changes within Markdown should be reported correctly...",
                leftValue:  "**This is bold**",
                rightValue: "*This is italic*",
                expected:   [{ value: "This is ", type: "unchanged"}, {value: "bold", type: "removed"}, { value: "italic", type: "added"}]
            },
            markdownAdded: {
                message:    "Markdown that is added should not be reported as a change...",
                leftValue:  "This is strong.",
                rightValue: "This is *strong*.",
                expected:   [{value: "This is strong.", type: "unchanged"}]
            },
            markdownRemoved: {
                message:    "Markdown that is removed should not be reported as a change...",
                leftValue:  "This is *strong*.",
                rightValue: "This is strong.",
                expected:   [{value: "This is strong.", type: "unchanged"}]
            }
        }
    }
});
