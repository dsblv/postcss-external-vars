'use strict';
const postcss = require('postcss');
const escapeString = require('escape-string-regexp');
const execall = require('execall');

const PLUGIN_NAME = 'external-vars';
const ALLOWED_TYPES = ['string', 'number'];
const CAPTURE_GROUP = '([^)};, ]+)';

function makeRe(prefix, flags) {
	return new RegExp(escapeString(prefix) + CAPTURE_GROUP, flags);
}

function checkProperty(obj, prop) {
	return typeof obj === 'object' && obj.hasOwnProperty(prop);
}

function nestedProperty(obj, path) {
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

function inject(string, obj, re) {
	return string.replace(re, (match, path) => nestedProperty(obj, path));
}

const externalVars = postcss.plugin(PLUGIN_NAME, opts => {
	opts = opts || {};

	const re = makeRe(opts.prefix || '$', 'g');

	return css => {
		css.walkDecls(decl => {
			try {
				decl.value = inject(decl.value, opts.data, re);
			} catch (err) {
				throw decl.error(err.message, {plugin: PLUGIN_NAME});
			}
		});
	};
});

externalVars.tester = opts => {
	opts = opts || {};
	const re = makeRe(opts.prefix || '$');

	return str => re.test(str);
};

externalVars.matcher = opts => {
	opts = opts || {};
	const re = makeRe(opts.prefix || '$', 'g');

	return str => execall(re, str).map(res => res.sub[0]);
};

module.exports = externalVars;
