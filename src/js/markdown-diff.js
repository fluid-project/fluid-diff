/* eslint-env node */
/*

    Add the ability to optionally compare blocks of markdown as strings.

 */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.diff");

/*

    Cheerio.js is a node-based jQuery alternative to allow parsing and interrogating HTML.  This stub allows us to use
    the same `load` method on both node and the browser.

*/
gpii.diff.cheerioBrowser = {
    load: function (htmlString) {
        return $(htmlString);
    }
};

var MarkDownIt = typeof require !== "undefined" ? require("markdown-it") : window.markdownit;
var cheerio    = typeof require !== "undefined" ? require("cheerio") : gpii.diff.cheerioBrowser;

/**
 *
 * Compare two Markdown strings and report their textual differences.
 *
 * @param leftMarkdown {String} - A string containing markdown.
 * @param rightMarkdown {String} - A string to compare to `leftMarkdown`.
 * @param markdownItOptions {Object} - Configuration options to pass to MarkdownIt.  See their docs for supported options.
 * @returns {*}
 *
 */
gpii.diff.compareMarkdown = function (leftMarkdown, rightMarkdown, markdownItOptions) {
    if (leftMarkdown === undefined || rightMarkdown === undefined || typeof leftMarkdown !== "string" || typeof rightMarkdown !== "string") {
        return gpii.diff.singleValueDiff(leftMarkdown, rightMarkdown);
    }
    else {
        var leftString = gpii.diff.markdownToText(leftMarkdown, markdownItOptions);
        var rightString = gpii.diff.markdownToText(rightMarkdown, markdownItOptions);
        return gpii.diff.compareStrings(leftString, rightString);
    }
};

/**
 *
 * Render a string containing markdown as HTML, then return the textual content.
 *
 * @param markdown {String} - A string containing markdown.
 * @param markdownItOptions {Object} - Configuration options to pass to MarkdownIt.  See their docs for supported options.
 * @returns {String} - The textual content.
 *
 */
gpii.diff.markdownToText = function (markdown, markdownItOptions) {
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
