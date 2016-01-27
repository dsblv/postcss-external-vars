# postcss-external-vars [![Build Status](https://travis-ci.org/dsblv/postcss-external-vars.svg?branch=master)](https://travis-ci.org/dsblv/postcss-external-vars)

> [PostCSS] plugin for injecting external variables to your CSS.

[PostCSS]: https://github.com/postcss/postcss


```css
/* Input example */
.foo {
  color: $color.primary;
}
```

```css
/* Output example */
.foo {
  color: #bada55;
}
```


## Install

```
$ npm install postcss-external-vars
```


## Usage

```js
const externalVars = require('postcss-external-vars');

const data = {
	color: {
		primary: '#bada55',
		background: '#1337af'
	}
};

const css = '.foo {color: $color.primary}';

// Use stand-alone:
const result = externalVars.process(css, {data}).css;
//=> '.foo {color: #bada55}'

// Or as PostCSS plugin:
const postcss = require('postcss');

const result = postcss([externalVars({data})]).process(css).css;
//=> '.foo {color: #bada55}'
```

Check [PostCSS] docs out for examples in your preferred environment.


## API

### externalVars({opts})

#### opts

##### data

Type: `object`  
*Required*

An `object` of properties to be used within your CSS.

##### prefix

Type: `string`  
Default: `$`

A prefix for variable names. May contain several characters.


## License

MIT © [Dmitriy Sobolev](https://github.com/dsblv)
