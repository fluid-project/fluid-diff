# `fluid-diff`

This package is designed to "diff" two pieces of data and produce output that can be used to explore the differences.

There is a standard for representing differences between JSON structures
[as a patch](https://tools.ietf.org/html/rfc6902),  but the goal there is to produce output that can be used to
faithfully "undo" and "redo" a given set of changes.

Our goal is to produce a more expansive structure that includes:

1. Information that has not changed.
2. Information that has been removed.
3. Information that has been added.
4. Detailed information about changes to a single string.

The focus here is not on changes to the deep structure, only changes in values (strings, numbers, etc.) are represented.
This is intended to provide just enough information to present an annotated representation of a given set of changes.
For this purpose, there are [Handlebars](http://handlebarsjs.com) templates provided in this package, which can be used
with  [`fluid-handlebars`](https://github.com/fluid-project/fluid-handlebars) to convert the "diff" JSON structure
produced by this package into:

* text
* HTML
* markdown

## Installation

To add this package to your project, use a command like `npm install --save fluid-diff`.

## Further Reading

1. For more details about generating a "diff", see the list of [available functions](docs/functions.md).
2. For examples of using a "diff" on its own and in combination with handlebars templates, see the [tutorial](docs/tutorial.md).
