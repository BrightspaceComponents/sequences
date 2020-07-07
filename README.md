# d2l-sequences
[![Build Status](https://www.travis-ci.com/BrightspaceHypermediaComponents/sequences.svg?branch=master)](https://www.travis-ci.com/BrightspaceHypermediaComponents/sequences)

A set of web components written in [Polymer](https://www.polymer-project.org) to support the siren content hypermedia domain.

## Installation

```shell
npm install
```

To start a local web server that hosts the demo page and tests:

 ```shell
polymer analyze > analysis.json && polymer serve
```

 The demo will be available at http://127.0.0.1:port/components/d2l-sequences/demo/. Port is printed to console after the server starts. Alternatively, you can run the following command and then add /demo to the end of the URL:

 ```shell
polymer analyze > analysis.json && polymer serve --open
```

`d2l-sequence-navigator`'s demo is available at http://127.0.0.1:port/components/d2l-sequences/demo/d2l-sequence-navigator/

`d2l-sequence-viewer`'s demo is available at http://127.0.0.1:port/components/d2l-sequences/demo/d2l-sequence-viewer/

A demo with the new content alert enabled is available at this URL: [http://127.0.0.1:port/components/d2l-sequences/demo/d2l-sequence-viewer/with-alert.html](http://127.0.0.1:8081/components/d2l-sequences/demo/d2l-sequence-viewer/with-alert.html)

## Usage

All of the d2l-sequences components require a `href` and a `token` parameter.

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/2.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

To start a [local web server](https://www.polymer-project.org/2.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

To lint ([eslint](http://eslint.org/) and [Polymer lint](https://www.polymer-project.org/2.0/docs/tools/polymer-cli-commands#lint)):

```shell
npm run lint
```

To run unit tests locally using [Polymer test](https://www.polymer-project.org/2.0/docs/tools/polymer-cli-commands#tests):

```shell
polymer test --skip-plugin sauce
```

To lint AND run local unit tests:

```shell
npm test
```

To build the lang terms:

```shell
npm build:lang
```

## Versioning, Releasing & Deploying

By default, when a pull request is merged the patch version in the `package.json` will be incremented, a tag will be created, and a Github release will be created.

Include `[increment major]`, `[increment minor]` or `[skip version]` in your merge commit message to change the default versioning behavior.
