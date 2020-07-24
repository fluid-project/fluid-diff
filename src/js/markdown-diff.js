/* eslint-env node */
/*

    Add the ability to optionally compare blocks of markdown as strings.

 */
"use strict";
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.diff");

/*

    Cheerio.js is a node-based jQuery alternative to allow parsing and interrogating HTML.  This stub allows us to use
    the same `load` method on both node and the browser.

*/
fluid.diff.cheerioBrowser = {
    load: function (htmlString) {
        return $(htmlString);
    }
};

var MarkDownIt = typeof require !== "undefined" ? require("markdown-it") : window.markdownit;
var cheerio    = typeof require !== "undefined" ? require("cheerio") : fluid.diff.cheerioBrowser;

/**
 *
 * Compare two Markdown strings and report their textual differences.
 *
 * The optional configuration options passed to this function can include  the following parameters.
 * `markdownItOptions` - Configuration options to pass to MarkdownIt.  See their docs for supported options.
 * `lcsOptions` - Options to control the "diff" operation, see the docs for fluid.diff.longestCommonSequences.
 *
 * @param {String} leftMarkdown - A string containing markdown.
 * @param {String} rightMarkdown - A string to compare to `leftMarkdown`.
 * @param {Object} options - Configurations options to control how the underlying difference engine and markdown rendering are handled.  See above.
 * @return {Array} - An array of segments representing everything that has changed (or not changed).
 *
 */
fluid.diff.compareMarkdown = function (leftMarkdown, rightMarkdown, options) {
    var markdownItOptions = fluid.get(options, "markdownItOptions");
    if (leftMarkdown === undefined || rightMarkdown === undefined || typeof leftMarkdown !== "string" || typeof rightMarkdown !== "string") {
        return fluid.diff.singleValueDiff(leftMarkdown, rightMarkdown);
    }
    else {
        var leftString = fluid.diff.markdownToText(leftMarkdown, markdownItOptions);
        var rightString = fluid.diff.markdownToText(rightMarkdown, markdownItOptions);
        return fluid.diff.compareStrings(leftString, rightString, options);
    }
};

/**
 *
 * Render a string containing markdown as HTML, then return the textual content.
 *
 * @param {String} markdown - A string containing markdown.
 * @param {Object} markdownItOptions - Configuration options to pass to MarkdownIt.  See their docs for supported options.
 * @return {String} - The textual content.
 *
 */
fluid.diff.markdownToText = function (markdown, markdownItOptions) {
    var mdRenderer = new MarkDownIt(markdownItOptions);
    var html = mdRenderer.render(markdown);
    var htmlWithHarderBreaks = html.replace(/<br ?\/?>(?![\r\n])/mig,"<br/>\n");
    var $ = cheerio.load(htmlWithHarderBreaks);
    // Replace all break tags with a break and a carriage return to assist in splitting up the output into lines.
    // The rendering cycle also introduces a trailing carriage return that we explicitly remove.
    var rawText = $.text();
    var textMinusTrailingReturn = rawText.replace(/[\r\n]+$/, "");
    return textMinusTrailingReturn;
};
