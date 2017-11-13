# Static Functions Provided by This Package

All of the functions provided by this package are static, and do not require you to instantiate a component.

## The "diff" Functions

### `gpii.diff.compare(leftElement, rightElement)`

* `leftElement`: An element (array, object, number, etc.).
* `rightElement`: An element to compare to `leftElement`.
* Returns: `{Object}` - An object that describes the differences between the two elements.

This function compares two elements of any type and returns the most fine-grained comparison possible.  It automatically
calls functions below depending on the variable type and value, and its output exactly matches each of the examples
below for the same inputs.

### `gpii.diff.compareArrays(leftArray, rightObject)`

* `leftArray`: An array of values.
* `rightArray`: An array of values to compare to `leftArray`.
* Returns: `{Array}` - An array of segments representing the changes in order.  May be larger than the original array (see below).

This function compares arrays in a way which is intended to assist in presenting changes to a list of values, in order.
For example:

```javascript
gpii.diff.compareArrays([0,1,2],[2,1,0]);

/* Returns:
[
    { value: 0, type: "removed"},
    { value: 2, type: "added"},
    { value: 1, type: "unchanged"},
    { value: 2, type: "removed"},
    { value: 0, type: "added"}
]
*/
```

### `gpii.diff.compareMarkdown(leftMarkdown, rightMarkdown, markdownItOptions)`

* `leftMarkdown` - A string containing markdown.
* `rightMarkdown` - A string to compare to `leftMarkdown`.
* `markdownItOptions` - An object representing configuration options to pass to MarkdownIt.  See their docs for supported options.
* Returns: `{Object}` A "diff" of the textual content of the two blocks of Markdown.

Compare the text of two Markdown strings and report their textual differences.  This function uses
[Markdown-It](https://github.com/markdown-it/markdown-it) to render the Markdown as HTML, and then extracts the text
using jQuery (in the browser) or [Cheerio.js](https://github.com/cheeriojs/cheerio) in Node.js.  Note that in order to
use this function in Node.js, you must have the optional Cheerio.js and Markdown-It dependencies installed.

### `gpii.diff.compareObjects(leftObject, rightObject)`

* `leftObject`: An object.
* `rightObject`: An object to compare to `leftObject`.
* Returns: `{Object}` - An object that describes the differences (and similarities) between the two objects (see below).

This function compares two objects (including `undefined`) to one another and produces a report regarding their
similarities and differences.  Note that this function does not attempt to represent the addition and deletion of
intermediate tree segments, and errs on the side of describing changes in a place where a "simple" value (string,
number, boolean, etc.) might expect to be found.  For example:

```javascript
gpii.diff.compareObjects({}, { foo: { bar: { baz: true }}});

/* Returns:
{
    foo: {
        bar: {
            baz: [{ value: true, type: "added"}]
        }
    }
}
*/
```

### `gpii.diff.compareStrings(leftString, rightObject)`

* `leftString`: A string.
* `rightArray`: A string to compare to `leftString`.
* Returns: `{Array}` - An array of "segments" representing `rightString` as compared to `leftString` (see below).

This function compares two strings and creates a set of segments detailing what has changed (or remained the same)
between the two.  This function uses `gpii.diff.longestCommonStringPhrase` (see below) to split longer strings up into:

* Material before the longest common "phrase".
* The longest common "phrase".
* Material after the longest common "phrase".

The leading and trailing material from `leftString` and `rightString` is compared, and the process continues to recurse
until there are no common phrases.  Here is an example of the output:

```javascript
gpii.diff.compareStrings("this definitely works", "this also works");
/* Returns:
[
    { value: "this ", type: "unchanged"},
    { value: "definitely", type: "removed"},
    { value: "also", type: "added"},
    { value: " works", type: "unchanged"}
]
*/
```

### `gpii.diff.singleValueDiff(leftValue, rightValue)`

* `leftValue`: The left-hand value.
* `rightValue`: The right-hand value.
* Returns: `{Object}` - An array of change segments (see below).

This function returns a representation of a "single value" change, with no deeper comparison.  This function always
produces a two-segment change in which the left value is removed and the right value is added, for example:

```javascript
gpii.diff.singleValueDiff(0, 1); // [{ value: 0, type: "removed"}, {value: 1, type: "added"}]
```

You are almost always better off using `gpii.diff.compare` or another more specific function, which will call this
function as needed.

## Supporting Functions

These functions are used by the comparison functions above, but are not guaranteed to be preserved as long term
features of this package

### `gpii.diff.arraysEqual(leftObject, rightObject)`

* `leftObject`: An array of values.
* `rightObject`: An array of values to compare to `leftArray`.
* Returns: `{Boolean}` - `true` if all elements in both arrays are equal, `false` otherwise.

Compare two arrays to see if all of their values are equal.

### `gpii.diff.calculateTightness(lcsSegments)`

* `lcsSegments` - An array of LCS segments, as returned from `gpii.diff.longestCommonSequence`.
* Returns: `{Number}` - A number representing the "tightness" (see below).

This function calculates the "tightness" of an array of LCS segments, where lower values are "tighter".  An array of
adjoining segments has a "tightness" of 0, as when evaluating the following:

`[{ leftIndex:0, rightIndex:0 }, { leftIndex:1, rightIndex:1}]`

An array that skips a single segment has a "tightness" of 1, as when evaluating the following:

`[{ leftIndex:0, rightIndex:0 }, { leftIndex:1, rightIndex:2}]`

This is used to sort segments so that the match with the most adjacent segments is preferred.

### `gpii.diff.equals(leftElement, rightElement)`

* `leftElement` `{Any}` - An `{Object}`, `{Array}`, `{String}`, or any other type of element.
* `rightElement` `{Any}` - A second element of any type to compare to `leftElement`.
* Returns: `{Boolean}` - `true` if the elements are equal, `false` if they are not.

This function compares any two elements for equality, including Arrays and Objects.  It calls the type-specific
comparison functions (`gpii.diff.compareArrays`, et cetera) as needed.

### `gpii.diff.extractSegments(originalString)`

* `originalString` - A string to break down into segments.
* Returns: `{Array}` - An array of substrings of alternating "word" and "non-word" content.

Break down a string into an array of "segments" of alternating "word" and "non-word" content.  So, for example, the
phrase "Stop, please." would be broken down into:

`["Stop", ", ", "please", "."]`

Please note, this function treats `null` and `undefined` values the same as empty strings.

### `gpii.diff.isStringNullOrUndefined(value)`

* `value` `{Any}` - A value to evaluate.
* Returns: `{Boolean}` - Returns `true` if the value is a {String}, `undefined`, or `null`.  Returns `false` otherwise.

`gpii.diff.compareStrings` can perform a deeper comparison of {String}, `undefined`, and `null` values.  This function
is used to determine whether we can perform that deeper comparison.

### `gpii.diff.longestCommonSequence(leftArray, rightArray)`

* `leftArray` `{Array}` - An array.
* `rightArray` `{Array}` - An array to compare to `leftArray`.
* Returns: `{Array}` - An array of objects describing the position of each segment in the longest common subsequence in the original arrays.

Compare two arrays, returning the longest common sequence (not necessarily contiguous).  When comparing `[1,3,5,7]`
to `[0,1,2,3,4,5,6]`, `[1,3,5,7]` is the longest sequence.  Follows a modified version of the LCS approach outlined
in [the Wikipedia entry for LCS](http://en.wikipedia.org/wiki/Longest_common_subsequence_problem).

The output returned describes the match in terms of the position of each segment in `leftArray` and `rightArray`.
So, for example, when comparing `["foo","bar", "quux"]` to `["bar","baz", "qux", "quux"]`, this function would return:

`[{ leftIndex: 1, rightIndex: 0 }, { leftIndex: 2, rightIndex: 3} ] // "bar" and "quux"`

### `gpii.diff.longestDistinctSequences(sequences)`

* `sequences` `{Array}` - An array of arrays of match segments, ala `[[{ leftIndex:0, rightIndex:1}]]`
* Returns: `{Array}` - An array of only the longest distinct sequences.

Return the longest distinct LCS sequences from an array.  Used to ensure that each sub-match only propagates once.

### `gpii.diff.markdownToText(markdown, markdownItOptions)`

* `markdown` `{String}` - A string containing markdown.
* `markdownItOptions` `{Object}` - Configuration options to pass to MarkdownIt.  See their docs for supported options.
* Returns: `{String}` - The textual content.

Use [Markdown-It](https://github.com/markdown-it/markdown-it) to render a string containing markdown as HTML, then
return the textual content.

### `gpii.diff.objectsEqual(leftObject, rightObject)`

* `leftObject`: An object.
* `rightObject`: An object to compare to `leftObject`.
* Returns: `{Boolean}` - `true` if the objects are deeply equal, `false` otherwise.

Deeply compare two objects to see if all of their values are equal.

### `gpii.diff.sortByLengthThenTightnessThenIndex(a, b)`

* `a` `{Array}` - An array of LCS segments.
* `b` `{Array}` - An array to compare with `a`.
* Returns: `{Number}` - `-1` if `a` is "first", `1` if `b` is "first", `0` if their position is interchangeable.

Sort arrays by the highest length, and then by the "tightest" grouping of elements (see `gpii.diff.calculateTightness`
above), then by the lowest (average) index of the first segment.