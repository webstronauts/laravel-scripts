<div align="center">
<h1>laravel-scripts 🛠📦</h1>
<p>A front-end CLI toolbox used by <a href="https://github.com/webstronauts/laravel-liftoff">Laravel Liftoff</a>.</p>
</div>

<hr />

[![License](https://img.shields.io/github/license/webstronauts/laravel-scripts.svg)](LICENSE.md)
[![Version](https://img.shields.io/npm/v/@webstronauts/laravel-scripts.svg)](https://www.npmjs.com/package/@webstronauts/laravel-scripts)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)

## Installation

This package is distributed via [NPM](https://www.npmjs.com/package/@webstronauts/laravel-scripts) which is bundled with [Node](https://nodejs.org/) and should be installed as one of your project's `devDependencies`:

```
npm install --save-dev @webstronauts/laravel-scripts
```

## Usage

This is a CLI and exposes a bin called `laravel-scripts`. We don't really plan on documenting or testing it very well because it's really specific to our custom [Laravel boilerplate](https://github.com/webstronauts/laravel-liftoff). You'll find all available scripts in `lib/scripts`. Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development mode. It will recompile all assets when any changes are detected.

### `npm run build` or `yarn build`

Builds the app for production to the public folder. The build is minified and the filenames include the hashes.

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.

## Inspiration

This package won't be there without the help and inspiration of the following projects;

* [facebook/create-react-app](https://github.com/facebook/create-react-app)
* [JeffreyWay/laravel-mix](https://github.com/JeffreyWay/laravel-mix)
* [jaredpalmer/razzle](https://github.com/jaredpalmer/razzle)
* [zeit/next.js](https://github.com/zeit/next.js)
* [developit/preact-cli](https://github.com/developit/preact-cli)

## License

MIT © [The Webstronauts](https://www.webstronauts.co?utm_source=github&utm_medium=readme&utm_content=laravel-scripts)
