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
 * Sort arrays by the highest length, and then by the "tightest" grouping of elements, then by the lowest (average)
 * index of the first segment.
 *
 * @param a {Object} - An array.
 * @param b {Object} - An array to compare with `a`.
 * @returns {number} - -1 if `a` is "first", 1 if `b` is "first", 0 if their position is interchangeable.
 *
 */
gpii.diff.sortByLengthThenTightnessThenIndex = function (a, b) {
    // a is a longer array
    if (a.length > b.length) {
        return -1;
    }
    // the arrays are the same length
    else if (a.length === b.length) {
        var aTightness = gpii.diff.calculateTightness(a);
        var bTightness = gpii.diff.calculateTightness(b);
        if (aTightness < bTightness) {
            return -1 ;
        }
        else if (aTightness === bTightness) {
            var aIndex = (a[0].leftIndex + a[0].rightIndex) / 2;
            var bIndex = (b[0].leftIndex + b[0].rightIndex) / 2;
            // a has the earliest occurring subsequence
            if (aIndex < bIndex) {
                return -1;
            }
            // It's not possible to reach this through normal operation, but it's included to complete the "sort" contract.
            else if (aIndex === bIndex) {
                return 0;
            }
            // b has the earliest occurring subsequence
            else if (bIndex < aIndex) {
                return 1;
            }
        }
        else if (aTightness > bTightness) {
            return 1;
        }
    }
    // b is a longer array.
    else {
        return 1;
    }
};

/**
 *
 * Calculate the "tightness" of an array of LCS segments, where lower values are "tighter".  An array of adjoining
 * segments has a "tightness" of 0, as when evaluating the following:
 *
 * `[{ leftIndex:0, rightIndex:0 }, { leftIndex:1, rightIndex:1}]`
 *
 * An array that skips a single segment has a "tightness" of 1, as when evaluating the following:
 *
 * `[{ leftIndex:0, rightIndex:0 }, { leftIndex:1, rightIndex:2}]`
 *
 * @param lcsSegments {Array} - An array of LCS segments.
 * @returns {Number} - A number representing the "tightness".
 *
 */
gpii.diff.calculateTightness = function (lcsSegments) {
    if (lcsSegments.length <= 1) {
        return 0;
    }
    else {
        var firstSegment = lcsSegments[0];
        var lastSegment  = lcsSegments[lcsSegments.length - 1];

        var leftDistance = lastSegment.leftIndex - firstSegment.leftIndex - (lcsSegments.length - 1);
        var rightDistance = lastSegment.rightIndex - firstSegment.rightIndex - (lcsSegments.length - 1);

        return (leftDistance + rightDistance) / 2;
    }
};

/**
 *
 * Break down a string into an array of "segments" of alternating "word" and "non-word" content.  Treats `null` and
 * `undefined` values the same as empty strings.
 *
 * @param originalString {String} - A string to break down into segments.
 * @returns {Array} - An array of substrings.
 */
gpii.diff.extractSegments = function (originalString) {
    var segments = [];

    if (typeof originalString === "string") {
        var matches = originalString.match(/([\w]+|[\W]+)/mg);
        if (matches) {
            segments = segments.concat(matches);
        }
    }
    else if (originalString !== undefined && originalString !== null) {
        fluid.fail("gpii.diff.extractStrings can only be used with string, undefined, or null values.");
    }

    return segments;
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
    if (leftString === undefined && rightString === undefined) {
        return gpii.diff.singleValueDiff(leftString, rightString);
    }
    else if (gpii.diff.isStringNullOrUndefined(leftString) && gpii.diff.isStringNullOrUndefined(rightString)) {
        var leftSegments  = gpii.diff.extractSegments(leftString);
        var rightSegments = gpii.diff.extractSegments(rightString);
        var arrayDiff = gpii.diff.compareArrays(leftSegments, rightSegments);
        var stringDiff = [];
        fluid.each(arrayDiff, function (arrayDiffSegment) {
            stringDiff.push({ value: arrayDiffSegment.arrayValue.join(""), type: arrayDiffSegment.type});
        });
        return stringDiff;
    }
    else {
        return gpii.diff.compare(leftString, rightString);
    }
};

/**
 *
 * `gpii.diff.compareStrings` can perform a deeper comparison of {String}, `undefined`, and `null` values.  This
 * function is used to determine whether we can perform that deeper comparison.
 *
 * @param value {Any} - A value to evaluate.
 * @returns {boolean} - Returns `true` if the value is a {String}, `undefined`, or `null`.  Returns `false` otherwise.
 *
 */
gpii.diff.isStringNullOrUndefined = function (value) {
    return typeof value === "string" || value === undefined || value === null;
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
 * Compare two arrays, returning the longest common sequence (not necessarily contiguous).  When comparing `[1,3,5,7]`
 * to `[0,1,2,3,4,5,6]`, `[1,3,5,7]` is the longest sequence.  Follows a modified version of the LCS approach outlined
 * here:
 *
 * http://en.wikipedia.org/wiki/Longest_common_subsequence_problem
 *
 * The output returned describes the match in terms of the position of each segment in `leftArray` and `rightArray`.
 * So, for example, when comparing `["foo","bar", "quux"]` to `["bar","baz", "qux", "quux"]`, this function would return:
 *
 * [{ leftIndex: 1, rightIndex: 0 }, { leftIndex: 2, rightIndex: 3} ] // "bar" and "quux"
 *
 * @param leftArray {Array} - An array.
 * @param rightArray {Array} - An array to compare to `leftArray`.
 * @returns {Array} - An array of objects describing the position of each segment in the longest common subsequence in the original arrays.
 *
 */
gpii.diff.longestCommonSequence = function (leftArray, rightArray) {
    var longestCommonSequence = [];

    if (Array.isArray(leftArray) && leftArray.length && Array.isArray(rightArray) && rightArray.length) {
        var previousRow = fluid.generate(leftArray.length, []);
        var currentRow = fluid.generate(rightArray.length, []);
        for (var a = 0; a < leftArray.length; a++) {
            for (var b = 0; b < rightArray.length; b++) {
                var cellSequences = [];
                // This should only pull the longest of the previous sequences, or both if they are of equal length.
                var inheritedSequences = [];
                // Pull in results from our "upstairs neighbor".
                if (a > 0 && previousRow[b].length) {
                    inheritedSequences = inheritedSequences.concat(previousRow[b]);
                }
                // Pull in additional results from our immediately prior "neighbor".
                if (b > 0 && currentRow[b - 1].length) {
                    inheritedSequences = inheritedSequences.concat(currentRow[b - 1]);
                }

                // Add the longest distinct sequences to our set of longest matches.
                if (inheritedSequences.length) {
                    cellSequences = cellSequences.concat(gpii.diff.longestDistinctSequences(inheritedSequences));
                }

                if (gpii.diff.equals(leftArray[a], rightArray[b])) {
                    if (cellSequences.length === 0) {
                        cellSequences.push([]);
                    }

                    for (var c = 0; c < cellSequences.length; c++) {
                        var sequence = cellSequences[c];
                        var cellMatchSegment = { leftIndex: a, rightIndex: b };
                        if (sequence.length) {
                            var lastSequenceSegment = sequence[sequence.length - 1];
                            if ((lastSequenceSegment.leftIndex === undefined || lastSequenceSegment.leftIndex < a) && (lastSequenceSegment.rightIndex === undefined || lastSequenceSegment.rightIndex < b)) {
                                sequence.push(cellMatchSegment);
                            }
                        }
                        else {
                            sequence.push(cellMatchSegment);
                        }
                    }
                }
                // TODO: Remove this when we no longer need to look at the complete solution table.
                // console.log("a:", a, "b:", b, " = ", JSON.stringify(cellSequences));
                currentRow[b] = cellSequences;
            }
            previousRow = currentRow;
        }
        var lastCell = currentRow[rightArray.length - 1];
        if (lastCell.length) {
            lastCell.sort(gpii.diff.sortByLengthThenTightnessThenIndex);

            // Return only the first, longest sequence.
            longestCommonSequence = lastCell[0];
        }
    }

    return longestCommonSequence;
};

/**
 *
 * Return the longest distinct sequences from an array.
 *
 * @param sequences {Array} - An array of arrays of match segments, ala `[[{ leftIndex:0, rightIndex:1}]]`
 * @returns {Array} - An array of only the longest distinct sequences.
 *
 */
gpii.diff.longestDistinctSequences = function (sequences) {
    var longestSequences = [];
    if (sequences.length > 0) {
        var sortedSequences = fluid.copy(sequences).sort(gpii.diff.sortByLengthThenTightnessThenIndex);
        var longestEntry = sortedSequences[0];
        longestSequences.push(longestEntry);
        fluid.each(sortedSequences.slice(1), function (sequence) {
            if (sequence.length === longestEntry.length && !gpii.diff.arraysEqual(sequence, longestEntry)) {
                longestSequences.push(sequence);
            }
        });
    }
    return longestSequences;
};

/**
 *
 * Compare any two elements for equality, including Arrays and Objects.
 *
 * @param leftElement {Any} - An {Object}, {Array}, {String}, or any other type of element.
 * @param rightElement {Any} - A second element of any type to compare to `leftElement`.
 * @returns {Boolean} - `true` if the elements are equal, `false` if they are not.
 *
 */
gpii.diff.equals = function (leftElement, rightElement) {
    if (typeof leftElement !== typeof rightElement) {
        return false;
    }
    // Need to run these checks before the "object" branch because `typeof []` is also `object`.
    else if (Array.isArray(leftElement) && Array.isArray(rightElement)) {
        return gpii.diff.arraysEqual(leftElement, rightElement);
    }
    else if (Array.isArray(leftElement) || Array.isArray(rightElement)) {
        return false;
    }
    // Now that undefined and Array values have been dealt with, anything remaining of type "object" can be handled as such.
    else if (typeof leftElement === "object") {
        return gpii.diff.objectsEqual(leftElement, rightElement);
    }
    else {
        return leftElement === rightElement;
    }
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
            // Find the longest match, process it, then process any trailing and leading material.
            var longestCommonSequence = gpii.diff.longestCommonSequence(leftArray, rightArray);
            if (longestCommonSequence.length) {
                var firstSegment = longestCommonSequence[0];
                // Compare the "leaders"
                var leftLeader = leftArray.slice(0, firstSegment.leftIndex);
                var rightLeader = rightArray.slice(0, firstSegment.rightIndex);
                if (leftLeader.length || rightLeader.length) {
                    var leadingSegments = gpii.diff.compareArrays(leftLeader, rightLeader);
                    segments = segments.concat(leadingSegments);
                }

                // Add all parts of the longest common sequence, and any material between adjoining segments.
                var adjoiningSegments  = [leftArray[longestCommonSequence[0].leftIndex]];
                var previousLeftIndex  = longestCommonSequence[0].leftIndex;
                var previousRightIndex = longestCommonSequence[0].rightIndex;
                fluid.each(longestCommonSequence.slice(1), function (sequenceSegment) {
                    var segmentValue = leftArray[sequenceSegment.leftIndex];
                    // adjoining segment
                    if ((sequenceSegment.leftIndex === previousLeftIndex + 1) && (sequenceSegment.rightIndex === previousRightIndex + 1)) {
                        adjoiningSegments.push(segmentValue);
                    }
                    // non-adjoining segment
                    else {
                        segments.push({ arrayValue: adjoiningSegments, type: "unchanged"});
                        adjoiningSegments = [segmentValue];

                        // Iterate through the "removed" left elements.
                        var deletedSegments = leftArray.slice(previousLeftIndex + 1, sequenceSegment.leftIndex);
                        if (deletedSegments.length) {
                            segments.push({arrayValue: deletedSegments, type: "removed"});
                        }

                        // Iterate through the "added" right elements.
                        var addedSegments = rightArray.slice(previousRightIndex + 1, sequenceSegment.rightIndex);
                        if (addedSegments.length) {
                            segments.push({arrayValue: addedSegments, type: "added"});
                        }
                    }
                    previousLeftIndex = sequenceSegment.leftIndex;
                    previousRightIndex = sequenceSegment.rightIndex;
                });
                segments.push({ arrayValue: adjoiningSegments, type: "unchanged"});

                // Compare the "trailers"
                var lastSegment = longestCommonSequence[longestCommonSequence.length - 1];
                var leftTrailer = leftArray.slice(lastSegment.leftIndex + 1);
                var rightTrailer = rightArray.slice(lastSegment.rightIndex + 1);
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
    // Both leftObject and rightObject are `undefined`.
    else if ((leftObject === undefined && rightObject === undefined)) {
        results = gpii.diff.singleValueDiff(leftObject, rightObject);
    }
    // Both values are an empty object.
    else if (gpii.diff.objectsEqual(leftObject, rightObject)) {
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
        return gpii.diff.singleValueDiff(leftElement, rightElement);
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
