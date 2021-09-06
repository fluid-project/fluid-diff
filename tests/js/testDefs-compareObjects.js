/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("fluid.test.diff.testDefs.compareObjects", {
    gradeNames: ["fluid.component"],
    // We need to be able to compare actual undefined values, so we have to avoid the default merging and expansion.
    mergePolicy: {
        "testDefs.objects": "nomerge, noexpand"
    },
    testDefs: {
        objects: {
            changedShallowValue: {
                message:    "We should be able to detect shallow 'changed' material.",
                leftValue:  { foo: 0 },
                rightValue: { foo: 1 },
                expected:   { foo: [{value: 0, type: "removed"}, { value: 1, type: "added"}]}
            },
            changedDeepValue: {
                message:    "We should be able to detect deep 'changed' material.",
                leftValue:  { foo: { bar: 0 } },
                rightValue: { foo: { bar: 1 } },
                expected:   { foo: { bar: [{value: 0, type: "removed"}, { value: 1, type: "added"}] } }
            },
            changedShallowString: {
                message:    "We should be able to detect shallow 'changed' strings.",
                leftValue:  { foo: "old string" },
                rightValue: { foo: "new string" },
                expected:   { foo: [{value: "old", type: "removed"}, { value: "new", type: "added"}, { value: " string", type: "unchanged"}]}
            },
            changedDeepString: {
                message:    "We should be able to detect deep 'changed' strings.",
                leftValue:  { foo: { bar: "old string" } },
                rightValue: { foo: { bar: "new string" } },
                expected:   { foo: { bar: [{value: "old", type: "removed"}, { value: "new", type: "added"}, { value: " string", type: "unchanged"}]}}
            },
            changedShallowArray: {
                message:    "We should be able to detect shallow 'changed' arrays.",
                leftValue:  { foo: [] },
                rightValue: { foo: [0] },
                expected:   { foo: [{arrayValue: [0], type: "added"}]}
            },
            changedDeepArray: {
                message:    "We should be able to detect deep 'changed' arrays.",
                leftValue:  { foo: { bar: [] } },
                rightValue: { foo: { bar: [0] } },
                expected:   { foo: { bar: [{arrayValue: [0], type: "added"}]} }
            },
            unchangedShallowValue: {
                message:    "We should be able to detect shallow 'unchanged' material.",
                leftValue:  { foo: "bar" },
                rightValue: { foo: "bar" },
                expected:   { foo: [{value: "bar", type: "unchanged"}]}
            },
            unchangedDeepValue: {
                message:    "We should be able to detect deep 'unchanged' material.",
                leftValue:  { foo: { bar: "baz" } },
                rightValue: { foo: { bar: "baz" } },
                expected:   { foo: { bar: [{value: "baz", type: "unchanged"}] } }
            },
            emptyObjects: {
                message:    "We should be able to deal with top-level empty objects.",
                leftValue:  {},
                rightValue: {},
                expected:   {"": [{ value: {}, type: "unchanged"}]}
            },
            emptyObjectsDeep: {
                message:    "We should be able to deal with deep empty objects.",
                leftValue:  { foo: {} },
                rightValue: { foo: {} },
                expected:   { foo: { "": [{ value: {}, type: "unchanged" }] } }
            },
            addedShallowValue: {
                message:    "We should be able to detect shallow added material.",
                leftValue:  {},
                rightValue: { foo: "bar" },
                expected:   { foo: [{value: "bar", type: "added"}]}
            },
            addedDeepValue: {
                message:    "We should be able to detect deep added material.",
                leftValue:  { foo: {} },
                rightValue: { foo: { bar: "baz" } },
                expected:   { foo: { bar: [{ value: "baz", type: "added"}] } }
            },
            addedMultiLevelValue: {
                message:    "We should be able to detect multiple levels of material added in one change.",
                leftValue:  {},
                rightValue: { foo: { bar: { baz: { qux: "quux" } } } },
                expected:   { foo: { bar: { baz: { qux: [{ value: "quux", type: "added"}] } } } }
            },
            emptyAddedArray: {
                message:    "We should be able to detect empty 'added' arrays.",
                leftValue:  {},
                rightValue: { foo: [] },
                expected:   { foo: [{value: [], type: "added"}]}
            },
            addedDeepArray: {
                message:    "We should be able to detect deep 'added' arrays.",
                leftValue:  { foo: { bar: [] } },
                rightValue: { foo: { bar: [0] } },
                expected:   { foo: { bar: [{arrayValue: [0], type: "added"}]} }
            },
            deletedShallowValue: {
                message:    "We should be able to detect shallow deleted material.",
                leftValue:  { foo: "bar" },
                rightValue: {},
                expected:   { foo: [{value: "bar", type: "removed"}]}
            },
            deletedDeepValue: {
                message:    "We should be able to detect deep deleted material.",
                leftValue:  { foo: { bar: "baz" } },
                rightValue: { foo: {} },
                expected:   { foo: { bar: [{ value: "baz", type: "removed"}] }}
            },
            leftUndefined: {
                message:    "We should be able to compare 'undefined' with an empty object.",
                leftValue:  undefined,
                rightValue: {},
                expected:   { "": [{value: undefined, type: "removed"}, { value: {}, type: "added"}] }
            },
            rightUndefined: {
                message:    "We should be able to compare an empty object with 'undefined'.",
                leftValue:  {},
                rightValue: undefined,
                expected:   { "": [{ value: {}, type: "removed"}, { value: undefined, type: "added"}] }
            },
            rightDeepUndefined: {
                message:    "We should be able to compare a non-empty object with 'undefined'.",
                leftValue:  { foo: "bar"},
                rightValue: undefined,
                expected:   { "foo": [{ value: "bar", type: "removed"}] }
            },
            bothUndefined: {
                message:    "We should be able to compare 'undefined' values.",
                leftValue:  undefined,
                rightValue: undefined,
                expected:   [{ value: undefined, type: "unchanged"}]
            },
            shallowMarkdownAsString: {
                message:    "Shallow markdown should be handled as a string by default.",
                leftValue:  { md: "**bold**" },
                rightValue: { md: "*italic*" },
                expected:   { md: [{value: "**bold**", type: "removed"}, { value: "*italic*", type: "added"}]}
            },
            shallowMarkdownAsMarkdown: {
                message:    "We should be able to optionally handle shallow Markdown as Markdown.",
                leftValue:  { md: "**bold**" },
                rightValue: { md: "*italic*" },
                expected:   { md: [{value: "bold", type: "removed"}, { value: "italic", type: "added"}]},
                options: {
                    compareStringsAsMarkdown: true
                }
            },
            deepMarkdownAsString: {
                message:    "Deep markdown should be handled as a string by default.",
                leftValue:  { deep: { md: "**bold**" } },
                rightValue: { deep: { md: "*italic*" } },
                expected:   { deep: { md: [{value: "**bold**", type: "removed"}, { value: "*italic*", type: "added"}]} }
            },
            deepMarkdownAsMarkdown: {
                message:    "We should be able to optionally handle deep Markdown as Markdown.",
                leftValue:  { deep: { md: "**bold**" } },
                rightValue: { deep: { md: "*italic*" } },
                expected:   { deep: { md: [{value: "bold", type: "removed"}, { value: "italic", type: "added"}]} },
                options: {
                    compareStringsAsMarkdown: true
                }
            },
            deepComplexHtml: {
                message:    "We should be able to handle HTML tables.",
                leftValue:  { deep: { html: "<table border='0'><tr><td colspan='3'>The following specifications may only comply to some variants.</td></tr><tr><td colspan='3'><strong>Intended/suitable for one-hand operation</strong></td></tr><tr><td colspan='3'><strong>Left-hand keyboard</strong></td></tr><tr><td colspan='3'><strong>Wireless</strong></td></tr></table>" } },
                rightValue: { deep: { html: "<table border='0'><tr><td colspan='3'>The following specifications may only apply to some variants.</td></tr><tr><td colspan='3'><strong>Intended/suitable for one-hand operation</strong></td></tr><tr><td colspan='3'><strong>Left-hand keyboard</strong></td></tr><tr><td colspan='3'><strong>Wireless</strong></td></tr></table>" } },
                options: {
                    compareStringsAsMarkdown: true,
                    markdownItOptions: { html: true}
                },
                expected:   {
                    deep: {
                        html: [
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
        }
    }
});
