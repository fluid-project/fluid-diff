/* eslint-env node */
/*

    Static functions to produce a "diff" report in comparing two values.  See the documentation in this package for
    details.

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
 * Produce a representation of a "single value" change, with no deeper comparison.  Intended for use when either the
 * left or right side is a numeric, boolean, null, or undefined value.  For array values, `gpii.diff.compareArrays`
 * should be used instead.  For string values, `gpii.diff.compareStrings` should be used instead.  For object values
 * `gpii.diff.compareObjects` should be used instead.
 *
 * @param leftValue {Any} - The left-hand value.
 * @param rightValue {Any} - The right-hand value.
 * @param isArray {Boolean} - Whether we are dealing with arrays or not
 * @return {Array} - An array of segments representing everything that has changed (or not changed).
 *
 */
gpii.diff.singleValueDiff = function (leftValue, rightValue, isArray) {
    var key = isArray ? "arrayValue" : "value";
    var segments = [];
    if ((isArray && gpii.diff.arraysEqual(leftValue, rightValue)) || (!isArray && leftValue === rightValue)) {
        var unchangedSegment = { type: "unchanged"};
        unchangedSegment[key] = leftValue;
        segments.push(unchangedSegment);
    }
    else {
        if ((!isArray && leftValue !== undefined) || (isArray && leftValue.length)) {
            var removedSegment = { type: "removed" };
            removedSegment[key] = leftValue;
            segments.push(removedSegment);
        }
        if ((!isArray && rightValue !== undefined) || (isArray && rightValue.length)) {
            var addedSegment = { type: "added"};
            addedSegment[key] = rightValue;
            segments.push(addedSegment);
        }
    }
    return segments;
};

/**
 *
 * Find the longest matching "phrase" in two strings, which prefers one or more whole words.
 *
 * @param leftString {String} - One of the two strings, which will be used to search for matching patterns.
 * @param rightString {String} - The other string, which will be compared against all possible sub-patterns.
 * @return {Object} - See below.
 *
 * The object returned has three keys:
 *
 * `leftIndex`:  The position of the matching segment in `leftString`.  If there is no matching segment, this will be `-1`.
 * `rightIndex`: The position of the matching segment in `rightString`.  If there is no matching segment, this will be `-1`.
 * `segment`:    The longest matching string common to both strings.  If there are multiple matching strings of the same length, the first is returned.
 *
 */
gpii.diff.longestCommonStringPhrase = function (leftString, rightString) {
    var matchDef = {
        leftIndex: -1,
        rightIndex: -1,
        segment: ""
    };

    if (leftString && rightString) {
        var leftWordPhraseDefs = gpii.diff.extractPhraseSegments(leftString);

        var firstMatchDef = fluid.find(leftWordPhraseDefs, function (phraseDef) {
            var rightIndex = rightString.indexOf(phraseDef.value);
            if (rightIndex !== -1) {
                return {
                    segment: phraseDef.value,
                    leftIndex: phraseDef.index,
                    rightIndex: rightIndex
                };
            }
        });
        if (firstMatchDef) {
            matchDef = firstMatchDef;
        }
    }
    return matchDef;
};

/**
 *
 * A sort function to sort "phrase definitions" by their length (longest first), and then by their position in the
 * string (earliest first).
 *
 * @param a {Object} - An item in the array to compare.
 * @param b {Object} - The item to compare with `a`.
 * @returns {number} - -1 if `a` is "first", 1 if `b` is "first", 0 if their position is interchangeable.
 *
 */
gpii.diff.sortPhraseDefs = function (a, b) {
    if (a.value.length > b.value.length) {
        return -1;
    }
    else if (a.value.length === b.value.length) {
        if (a.index < b.index) {
            return -1;
        }
        else if (a.index === b.index) {
            return 0;
        }
        else if (b.index < a.index) {
            return 1;
        }
    }
    else {
        return 1;
    }
};

/**
 *
 * Break down a string into an array of "phrase segments", ordered from longest (the original string) to shortest (the
 * shortest individual word).  Each "phrase segment" looks like:
 * {
 *    value: "a word or phrase, possibly including whitespace ",
 *    index: 0 // The position of the phrase in `originalString`
 * }
 *
 * @param originalString {String} - The original string to break down.
 * @returns {Array} - An array of "phrase segments".
 *
 */
gpii.diff.extractPhraseSegments = function (originalString) {
    var regexp = /(\b[\w']+\b)(\W+)/gm;
    var currentPhraseDef = regexp.exec(originalString);

    // This was an empty string or undefined, it's not possible to match it with anything.
    if (!originalString || originalString.length === 0) {
        return [];
    }
    // There is only one "word" in this string.
    else if (currentPhraseDef === null) {
        return [{
            value: originalString,
            index: 0
        }];
    }
    else {
        var segments = [];
        // Check for leading whitespace first.
        var leadingWhitespaceMatches = originalString.match(/^(\W+)/);
        if (leadingWhitespaceMatches) {
            segments.push({
                value: leadingWhitespaceMatches[1],
                index: 0
            });
        }
        while (currentPhraseDef !== null) {
            // The first capture match is a "word"
            var word = currentPhraseDef[1];
            segments.push({
                value: word,
                index: currentPhraseDef.index
            });
            // The second (optional) match is the trailing whitespace.
            var trailingWhitespace = currentPhraseDef[2];
            if (trailingWhitespace.length) {
                segments.push({
                    value: trailingWhitespace,
                    index: currentPhraseDef.index + word.length
                });
            }
            currentPhraseDef = regexp.exec(originalString);
        }
        // Look for any trailing non-whitespace material after the initial pass.
        var trailingNonWhitespaceRegexp = /\w+\W+(\w+)$/m;
        var trailingMatches = originalString.match(trailingNonWhitespaceRegexp);
        if (trailingMatches) {
            segments.push({
                value: trailingMatches[1],
                index: originalString.length - trailingMatches[1].length
            });
        }

        var combinedSegments = [];
        for (var a = 0; a < segments.length; a++) {
            for (var b = a + 1; b <= segments.length; b++) {
                var subslice = segments.slice(a, b);
                var values = fluid.transform(subslice, function (item) { return item.value; });
                var substring = values.join("");
                if (substring.match(/\w/)) {
                    combinedSegments.push({
                        value: substring,
                        index: segments[a].index
                    });
                }
            }
        }

        combinedSegments.sort(gpii.diff.sortPhraseDefs);
        return combinedSegments;
    }
};

/**
 *
 * Go through a string and create a report that can be used to render a "diff" view.  The result is an array of
 * segments, which consist of a segment value and details about whether the segment is unchanged, added, or removed
 * when compared to `leftString`.
 *
 * @param `leftString` {String} - The first string, from whose perspective the "diff" results will be represented.
 * @param `rightString` {String} - The second string, to compare to the first string.
 * @return {Array} - An array of "segments" representing `rightString` as compared to `leftString`.
 *
 */
gpii.diff.compareStrings = function (leftString, rightString) {
    if (typeof leftString === "string" || typeof rightString === "string") {
        // Start by looking for a match against the longest section of our leading material that matches.
        if (leftString && leftString.length > 0) {
            var segments = [];
            var longestCommonPhraseDef = gpii.diff.longestCommonStringPhrase(leftString, rightString);
            // var longestCommonStringSegmentDef = longestCommonPhraseDef.segment.length ? longestCommonPhraseDef : gpii.diff.longestCommonStringSegment(leftString, rightString);
            if (longestCommonPhraseDef.segment.length > 1) {
                var leftLeader  = leftString.substring(0, longestCommonPhraseDef.leftIndex);
                var rightLeader = rightString.substring(0, longestCommonPhraseDef.rightIndex);
                if (longestCommonPhraseDef.leftIndex && longestCommonPhraseDef.rightIndex) {
                    var segmentsBeforeMatch = gpii.diff.compareStrings(leftLeader, rightLeader);
                    segments = segmentsBeforeMatch.concat(segments);
                }
                else if (longestCommonPhraseDef.leftIndex) {
                    var deletedLeader = leftLeader;
                    segments.push({value: deletedLeader, type: "removed"});
                }
                else if (longestCommonPhraseDef.rightIndex) {
                    var addedLeader = rightLeader;
                    segments.push({value: addedLeader, type: "added"});
                }

                segments.push({ value: longestCommonPhraseDef.segment, type: "unchanged"});

                var leftTrailer  = leftString.substring(longestCommonPhraseDef.leftIndex + longestCommonPhraseDef.segment.length);
                var rightTrailer = rightString.substring(longestCommonPhraseDef.rightIndex + longestCommonPhraseDef.segment.length);

                if (leftTrailer.length && rightTrailer.length) {
                    var segmentsAfterMatch = gpii.diff.compareStrings(leftTrailer, rightTrailer);
                    segments = segments.concat(segmentsAfterMatch);
                }
                else if (leftTrailer.length) {
                    segments.push({ value: leftTrailer, type: "removed"});
                }
                else if (rightTrailer.length) {
                    segments.push({ value: rightTrailer, type: "added"});
                }
            }
            else {
                segments.push({ value: leftString, type: "removed"});
                if (rightString !== undefined) {
                    segments.push({ value: rightString, type: "added"});
                }
            }

            return segments;
        }
        else {
            return gpii.diff.singleValueDiff(leftString, rightString);
        }
    }
    else {
        return gpii.diff.compare(leftString, rightString);
    }
};

/**
 *
 * Compare two Markdown strings and report their textual differences.
 *
 * @param leftMarkdown {String} - A string containing markdown.
 * @param rightMarkdown {String} - A string to compare to `leftMarkdown`.
 * @param markdownItOptions {Object} - Configuration options to pass to MarkdownIt.  See their docs for supported options.
 * @returns {*}
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
    var $ = cheerio.load(html);
    // The rendering cycle introduces a trailing carriage return that we explicitly remove.
    return $.text().replace(/[\r\n]+$/, "");
};

/**
 *
 * A function to compare two arrays and report their differences.
 *
 * @param leftArray - An array of values.
 * @param rightArray - An array of values to compare.
 * @return {Array} - An array of segments representing the changes in order.  May be larger than the original array.
 *
 */
gpii.diff.compareArrays = function (leftArray, rightArray) {
    if (!Array.isArray(leftArray) || !Array.isArray(rightArray)) {
        return gpii.diff.singleValueDiff(leftArray, rightArray);
    }
    else {
        var segments = [];

        if (gpii.diff.arraysEqual(leftArray, rightArray)) {
            segments.push({ arrayValue: leftArray, type: "unchanged"});
        }
        else {
            // Find the longest match, then process the remaining "tail" and "head", as with the string engine above.
            var longestCommonSegmentDef = gpii.diff.longestCommonArraySegment(leftArray, rightArray);
            if (longestCommonSegmentDef.segment.length) {
                // Compare the "leaders"
                var leftLeader = leftArray.slice(0, longestCommonSegmentDef.leftIndex);
                var rightLeader = rightArray.slice(0, longestCommonSegmentDef.rightIndex);
                if (leftLeader.length || rightLeader.length) {
                    var leadingSegments = gpii.diff.compareArrays(leftLeader, rightLeader);
                    segments = segments.concat(leadingSegments);
                }

                // Add the longest segment itself
                segments.push({ arrayValue: longestCommonSegmentDef.segment, type: "unchanged"});

                // Compare the "trailers"
                var leftTrailer = leftArray.slice(longestCommonSegmentDef.leftIndex + longestCommonSegmentDef.segment.length);
                var rightTrailer = rightArray.slice(longestCommonSegmentDef.rightIndex + longestCommonSegmentDef.segment.length);
                if (leftTrailer.length || rightTrailer.length) {
                    var trailingSegments = gpii.diff.compareArrays(leftTrailer, rightTrailer);
                    segments = segments.concat(trailingSegments);
                }
            }
            else {
                return gpii.diff.singleValueDiff(leftArray, rightArray, true);
            }
        }

        return segments;
    }
};

/***
 *
 * A function that returns the (first) longest matching segment found in two arrays.  We use this to tree out from the
 * best match within an array, so that we produce a change report with the least changes possible.
 *
 * @param leftArray - An array of values.
 * @param rightArray - An array of values to compare to `leftArray`.
 * @return {Object} - See below.
 *
 * The object returned has three keys:
 *
 * `leftIndex`:  The position of the matching segment in `leftArray`.  If there is no matching segment, this will be `-1`.
 * `rightIndex`: The position of the matching segment in `rightArray`.  If there is no matching segment, this will be `-1`.
 * `segment`:    The longest set of matching elements (in order) common to both arrays.  If there are multiple sets of the same length, the first is returned.
 *
 */
gpii.diff.longestCommonArraySegment = function (leftArray, rightArray) {
    var segmentDef = {
        leftIndex: -1,
        rightIndex: -1,
        segment: []
    };

    if (Array.isArray(leftArray) && Array.isArray(rightArray)) {
        for (var a = 0; a < leftArray.length; a++) {
            for (var b = a + 1; b <= leftArray.length; b++) {
                if ((b - a) > segmentDef.segment.length) {
                    var leftSlice = leftArray.slice(a, b);
                    var noMoreMatches = false;
                    var rightIndex = 0;
                    while (!noMoreMatches) {
                        rightIndex = rightArray.indexOf(leftSlice[0], rightIndex);
                        if (rightIndex !== -1) {
                            var rightSlice = rightArray.slice(rightIndex, rightIndex + leftSlice.length);
                            if (gpii.diff.arraysEqual(leftSlice, rightSlice) && leftSlice.length > segmentDef.segment.length) {
                                segmentDef.leftIndex  = a;
                                segmentDef.rightIndex = rightIndex;
                                segmentDef.segment    = leftSlice;
                            }
                            else {
                                noMoreMatches = true;
                            }
                        }
                        else {
                            noMoreMatches = true;
                        }
                    }
                }
            }
        }
    }

    return segmentDef;
};

/**
 *
 * Compare two arrays to see if their values are equal.
 *
 * @param leftArray {Array} - An array of values.
 * @param rightArray {Array} - An array of values to compare to `leftArray`.
 * @return {Boolean} - Returns `true` if all elements in both arrays are equal, `false` otherwise.
 *
 */
gpii.diff.arraysEqual = function (leftArray, rightArray) {
    if (typeof leftArray !== typeof rightArray) {
        return false;
    }
    else if (!Array.isArray(leftArray)) {
        fluid.fail("Cannot compare non-arrays using `gpii.diff.arraysEqual`...");
    }
    else if (leftArray.length !== rightArray.length) {
        return false;
    }
    else {
        var everythingMatches = rightArray.every(function (rightValue, index) {
            var leftValue = leftArray[index];
            if (typeof leftValue !== typeof rightValue) {
                return false;
            }
            else if (Array.isArray(leftValue)) {
                return gpii.diff.arraysEqual(leftValue, rightValue);
            }
            // We need to check this separately to distinguish null values from actual objects.
            else if (leftValue === null && rightValue === null) {
                return true;
            }
            else if (typeof leftValue === "object") {
                return gpii.diff.objectsEqual(leftValue, rightValue);
            }
            else {
                return rightValue === leftValue;
            }
        });
        return everythingMatches;
    }
};

/**
 *
 * Deeply compare two objects to see if their values are equal.
 *
 * @param leftObject {Object} - An object.
 * @param rightObject {Object} - An object to compare to `leftObject`.
 * @return {Boolean} - Returns `true` if the objects are deeply equal, `false` otherwise.
 *
 */
gpii.diff.objectsEqual = function (leftObject, rightObject) {
    if (typeof leftObject !== typeof rightObject) {
        return false;
    }
    else {
        var leftKeys = Object.keys(leftObject);
        if (leftKeys.length !== Object.keys(rightObject).length) {
            return false;
        }
        else {
            for (var a = 0; a < leftKeys.length; a++) {
                var key = leftKeys[a];
                var leftValue = leftObject[key];
                var rightValue = rightObject[key];
                if (typeof leftValue !== typeof rightValue) {
                    return false;
                }
                else if (Array.isArray(leftValue)) {
                    if (!gpii.diff.arraysEqual(leftValue, rightValue)) {
                        return false;
                    }
                }
                else if (typeof leftValue === "object") {
                    if (!gpii.diff.objectsEqual(leftValue, rightValue)) {
                        return false;
                    }
                }
                else if (leftValue !== rightValue) {
                    return false;
                }
            }

            return true;
        }
    }
};

/**
 *
 * Compare two objects and product a report about their differences.
 *
 * @param leftObject {Object} - An object.
 * @param rightObject {Object} - An object to compare with `leftObject`.
 * @param compareStringsAsMarkdown {Boolean} - Whether to compare strings as markdown.
 * @param markdownitOptions {Object} - Configuration options to pass to markdownit when dealing with markdown.  See their documentation for details.
 * @return results - An object that describes the differences (and similarities) between the two objects.
 *
 */
gpii.diff.compareObjects = function (leftObject, rightObject, compareStringsAsMarkdown, markdownitOptions) {
    var results = {};
    var leftKeys = leftObject !== undefined ? Object.keys(leftObject) : [];
    var rightKeys = rightObject !== undefined ? Object.keys(rightObject) : [];
    var combinedKeys = leftKeys.concat(rightKeys.filter(function (rightKey) { return leftKeys.indexOf(rightKey) === -1; }));
    if (combinedKeys.length) {
        for (var a = 0; a < combinedKeys.length; a++) {
            var key = combinedKeys[a];
            var leftValue  = leftObject !== undefined ? leftObject[key] : undefined;
            var rightValue = rightObject !== undefined ? rightObject[key] : undefined;
            results[key] = gpii.diff.compare(leftValue, rightValue, compareStringsAsMarkdown, markdownitOptions);
        }
    }
    // Both values are either an empty object or `undefined`.
    else if ((leftObject === undefined && rightObject === undefined) || gpii.diff.objectsEqual(leftObject, rightObject)) {
        results[""] = [{ value: leftObject, type: "unchanged"}];
    }
    else {
        results[""] = [{ value: leftObject, type: "removed"}, { value: rightObject, type: "added"}];
    }
    return results;
};

/**
 *
 * Compare a single element, using the correct comparison depending on the variable type.
 *
 * @param leftElement {Any} - An element (array, object, number, etc.).
 * @param rightElement {Any} - An element to compare to `leftElement`.
 * @param compareStringsAsMarkdown {Boolean} - Whether to compare strings as markdown.
 * @param markdownitOptions {Object} - Configuration options to pass to markdownit when dealing with markdown.  See their documentation for details.
 * @return {Object} - An object that describes the differences between the two elements.
 *
 */
gpii.diff.compare = function (leftElement, rightElement, compareStringsAsMarkdown, markdownitOptions) {
    var firstDefinedElement = leftElement !== undefined ? leftElement : rightElement;
    // Both are undefined
    if (firstDefinedElement === undefined) {
        return { "": gpii.diff.singleValueDiff(leftElement, rightElement) };
    }
    else if (Array.isArray(firstDefinedElement)) {
        return gpii.diff.compareArrays(leftElement, rightElement);
    }
    else if (typeof firstDefinedElement === "string") {
        return compareStringsAsMarkdown ? gpii.diff.compareMarkdown(leftElement, rightElement, markdownitOptions) : gpii.diff.compareStrings(leftElement, rightElement);
    }
    else if (typeof firstDefinedElement === "object") {
        return gpii.diff.compareObjects(leftElement, rightElement, compareStringsAsMarkdown, markdownitOptions);
    }
    else {
        return gpii.diff.singleValueDiff(leftElement, rightElement);
    }
};
