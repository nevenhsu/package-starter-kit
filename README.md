# package-starter-kit

This package shows how to get started with [rollup][rollup] (and [babel][babel]) for writing
npm packages using ES6 modules. Producing npm packages by [rollup][rollup] allows users to choose
whether they use it using the traditional `require` function understood by node.js, or using
the `import` statement addedin ES6 which can result in smaller bundles through live-code
inclusion static analysis.

You can code in ES6 or [TypeScript][typescript]. Both will be transformed into ES5 by babel.
If your packages are written in TypeScript, rollup automatically generates .d.ts files for you.

[babel]: https://github.com/babel/babel
[rollup]: https://github.com/rollup/rollup
[typescript]: https://github.com/microsoft/TypeScript

## Usage

You can simply use this project as inspiration for how to configure your own,
or clone it and edit the metadata files when starting your own project (i.e.
README.md, package.json, and LICENSE).

## How to use

First, go to the my-package folder, install the necessary packages.

```bash
cd my-package
npm install
```

Secondly, run build to generate es5 files into dist folder, and link it to npm locally.

```bash
npm run build
npm link
```

Then go to the example folder, link my-package to the project.

```bash
cd example
npm link my-package
```

Finally, you will notice that my-package is installed in node_modules successfully. Run code to test it.

```bash
node index.js
```
