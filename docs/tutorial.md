# Tutorial

This tutorial will take you through the process of generating a "diff" report comparing two objects, and then using a
handlebars template to generate a summary of the changes.  The examples are written with the Node.js environment
in mind.  For examples of using [fluid-handlebars](https://github.com/fluid-project/fluid-handlebars) in a browser, see that
package's documentation.

## The Data

Let's say we have an old and a new version of a record, and we want to explore the differences.  To compare these
versions, we will use [`fluid.diff.compare`](functions.md#fluiddiffcompareleftelement-rightelement), as shown in this
example:

```javascript
var fluid = require("infusion");
fluid.require("%fluid-diff");

var oldVersion = {
    "title": "This is the old title.",
    "description": "This is the old description.",
    "author": {
        "name": "This is the old author."
    }
};

var newVersion = {
    "title": "This is the new title.",
    "description": "This is the new description.",
    "author": {
        "name": "This is the new author."
    }
};

var diff = fluid.diff.compare(oldVersion, newVersion);
/*

    Returns:

    {
        "title": [{ "value": "This is the ", "type": "unchanged"}, { "value": "old", "type": "deleted"}, { "value": "new", "type": "added"}, { "value": "title.", "type": "unchanged"}]
        "description": [{ "value": "This is the ", "type": "unchanged"}, { "value": "old", "type": "deleted"}, { "value": "new", "type": "added"}, { "value": "description.", "type": "unchanged"}],
        "author": {
            "name": [{ "value": "This is the ", "type": "unchanged"}, { "value": "old", "type": "deleted"}, { "value": "new", "type": "added"}, { "value": "author.", "type": "unchanged"}]
        }
    }

 */
```

## Creating a Handlebars Template

To create your own templates, you will need to:

1. Create a template directory that contains a `pages`, `layouts`, and `partials` directory.
2. Add your pages in the `pages` subdirectory.
3. Register your package using `fluid.module.registerPath`.
4. Add your template directory (something like `%your-package/path/to/templates`)to the renderer's `templateDirs`.

See the [fluid-handlebars](https://github.com/fluid-project/fluid-handlebars) documentation for more details.  Let's say
we want to create a template to display the changes as text.  Our template might look like:

```handlebars
{{#if title~}}
    Title: {{>diff-text title}}
{{/if}}
{{#if description~}}
    Description: {{>diff-text description}}
{{/if}}
{{#if author.name~}}
    Author Name: {{>diff-text author.name}}
{{/if}}
```

Note that we use the tildes (`~`) to indicate that each block's output should strip leading whitespace.  This template
is saved to our test content, so you can simply include `%fluid-diff/tests/templates` in your `templateDirs`, as shown in
the next section.

## Rendering Content

So, now we need to create a renderer and use that to render our "diff" using our template:

```javascript
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var my    = fluid.registerNamespace("my");

fluid.require("%fluid-handlebars");
fluid.require("%fluid-diff");

var oldVersion = {
    "title": "This is the old title.",
    "description": "This is the old description.",
    "author": {
        "name": "This is the old author."
    }
};

var newVersion = {
    "title": "This is the new title.",
    "description": "This is the new description.",
    "author": {
        "name": "This is the new author."
    }
};

var diff = fluid.diff.compare(oldVersion, newVersion);

fluid.defaults("my.renderer", {
    gradeNames: ["fluid.handlebars.standaloneRenderer"],
    templateDirs: ["%fluid-diff/tests/templates", "%fluid-diff/src/templates"],
    components: {
        isDiffArray: {
            type: "fluid.diff.helper.isDiffArray"
        }
    }
});

var renderer = my.renderer();
var text = renderer.render("tutorial-text", diff);
console.log(text);

/*
    The console output is:

    Title: This is the -old-+new+ title.

    Description: This is the -old-+new+ description.

    Author: This is the -old-+new+ author.

 */
```

If you'd like to try this one your own, you might start by creating a template that outputs HTML, by using the `diff`
partial instead of the `diff-text` partial.
