'use strict';
const postcss = require('postcss');
const escapeString = require('escape-string-regexp');

const PLUGIN_NAME = 'external-vars';
const ALLOWED_TYPES = ['string', 'number'];

function generateRegExp(prefix) {
	const capture = '([^\\$\\,\\)\\; ]+)';
	return new RegExp(escapeString(prefix) + capture, 'g');
}

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

function inject(string, obj, regexp) {
	return string.replace(regexp, (match, path) => nestedProp(obj, path));
}

module.exports = postcss.plugin(PLUGIN_NAME, opts => {
	opts = opts || {};
	if (!('template' in opts)) {
		opts.template = false;
	}

	const regexp = generateRegExp(opts.prefix || '$');

	return css => {
		css.walkDecls(decl => {
			try {
				if (opts.template) {
					if (!decl.value.match(regexp)) {
						decl.remove();
					}
				} else {
					decl.value = inject(decl.value, opts.data, regexp);
				}
			} catch (err) {
				throw decl.error(err.message, {plugin: PLUGIN_NAME});
			}
		});
	};
});
