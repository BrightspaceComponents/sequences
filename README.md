# d2l-sequences
[![Build Status](https://www.travis-ci.com/BrightspaceHypermediaComponents/sequences.svg?branch=master)](https://www.travis-ci.com/BrightspaceHypermediaComponents/sequences)

A set of web components written in [Polymer](https://www.polymer-project.org) to support the siren content hypermedia domain.

## Installation

```shell
npm install
```

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
