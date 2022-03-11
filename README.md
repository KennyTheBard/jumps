# jumps
Boiler plate generator using a custom template mark-up language.

## Templates
Templates are used to generate snippets of code and have then copied directly to your clipboard. Any code or text can be a template. Templates can be generic by using variables. Variables are defined by simply using `%%` to mark them. Variables can contain only alpha-numerical characters (lowercase and uppercase) and underscores. A variable must always start with a letter. Once defined, every instance of it will be replaced with the same value.

### Example
This is the content of the template file used:
```
const %%var1%% = %%var2%%;
console.log(%%var1%%); // this will print %%var2%%
```

In order to add it to your templates run:
```
$ jumps template add example.txt --name example
```

In order to use an already added template to generate a code snippet, run:
```
$ jumps template use example
```

This will prompt you to enter the values for each variable:
```
$ jumps template use example
const %%var1%% = %%var2%%;
console.log(%%var1%%); // this will print %%var2%%

✔ Value for var1 ... a
✔ Value for var2 ... 1

const a = 1;
console.log(a); // this will print 1

Copied to clipboard!
```

## Bundles
Bundles are almost the same thing, with 2 exceptions:

- a bundle contains multiple templates, each preceded by a relative path to the destination file it will be written in
- using bundles will not copy a code snippet to your clipboard, but it will create the files with the generated content

### Example

```
%%% lib/print.js
export.module = {
   print: () => console.log("%%output%%"),
}

%%% index.js
require('./lib/print.js')(); // this will print %%output%%
```