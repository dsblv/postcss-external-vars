'use strict';
const postcss = require('postcss');

const PLUGIN_NAME = 'external-vars';
const ALLOWED_TYPES = ['string', 'number'];
const VAR_REGEXP = /\$([^\$\,\)\; ]+)/g;

function checkProperty(obj, prop) {
	return typeof obj === 'object' && obj.hasOwnProperty(prop);
}

function nestedProp(obj, path) {
	const ret = path.split('.').reduce((ret, prop, index, props) => {
		if (!checkProperty(ret, prop)) {
			const path = props.slice(0, index + 1).join('.');
			throw new TypeError(`"$${path}" is not defined`);
		}

		return ret[prop];
	}, obj);

	if (ALLOWED_TYPES.indexOf(typeof ret) === -1) {
		throw new TypeError(`The "$${path}" property has an inappropriate type`);
	}

	return ret;
}

function inject(string, obj) {
	return string.replace(VAR_REGEXP, (match, path) => nestedProp(obj, path));
}

module.exports = postcss.plugin(PLUGIN_NAME, opts => {
	opts = opts || {};

	return css => {
		css.walkDecls(decl => {
			try {
				decl.value = inject(decl.value, opts.data);
			} catch (err) {
				throw decl.error(err.message, {plugin: PLUGIN_NAME});
			}
		});
	};
});
