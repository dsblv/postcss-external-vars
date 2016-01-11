import postcss from 'postcss';
import test from 'ava';

import plugin from './';

function run(t, input, output, opts = {}) {
	return postcss([plugin(opts)])
		.process(input)
		.then(result => {
			t.same(result.css, output);
			t.same(result.warnings().length, 0);
		});
}

test('plain properties', t => {
	const data = {
		color: '#bada55'
	};

	return run(t, 'a {color: $color}', 'a {color: #bada55}', {data});
});

test('nested properties', t => {
	const data = {
		colors: {
			primary: '#bada55'
		}
	};

	return run(t, 'a {color: $colors.primary}', 'a {color: #bada55}', {data});
});

test('several properties per declaration', t => {
	const data = {
		padding: {
			vertical: '50px',
			horizontal: '100px'
		}
	};

	return run(t, 'body {padding: $padding.vertical $padding.horizontal}', 'body {padding: 50px 100px}', {data});
});

test('no data provided case', t => run(t, 'a {color: #bada55}', 'a {color: #bada55}'));
