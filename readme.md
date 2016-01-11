# postcss-external-vars [![Build Status](https://travis-ci.org/dsblv/postcss-external-vars.svg?branch=master)](https://travis-ci.org/dsblv/postcss-external-vars)

> [PostCSS] plugin to inject external variables to your CSS.

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


## Usage

```js
const postcss = require('postcss');
const externalVars = require('postcss-external-vars');

const data = {
	color: {
		primary: '#bada55',
		background: '#1337AF'
	}
};

postcss([externalVars({data})])
	.process('.foo {color: $color.primary}')
	.then(result => {
		console.log(result.css);
		//=> ".foo {color: #bada55}"
	});
```

See [PostCSS] docs for examples for your environment.


## Options

### data

An `object` of properties to be used within your CSS.


## License

MIT © [Dmitriy Sobolev](https://github.com/dsblv)
