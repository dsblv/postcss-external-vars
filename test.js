import postcss from 'postcss';
import test from 'ava';

import fn from './';

function run(t, input, output, opts = {}) {
	return postcss([fn(opts)])
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

test('commas in declaration', t => {
	const data = {
		colors: {
			top: '#bada55',
			bottom: 'black'
		}
	};

	const input = 'body {background: linear-gradient(top, $colors.top, $colors.bottom)}';
	const output = 'body {background: linear-gradient(top, #bada55, black)}';

	return run(t, input, output, {data});
});

test('custom prefix', t => {
	const data = {
		color: '#bada55'
	};
	const prefix = '~~';

	return run(t, 'a {color: ~~color}', 'a {color: #bada55}', {data, prefix});
});

test('no data provided case', t => run(t, 'a {color: #bada55}', 'a {color: #bada55}'));

test('fn.tester()', t => {
	const defaultTest = fn.tester();

	t.true(defaultTest('$yo'));
	t.false(defaultTest('!yo'));

	const customTest = fn.tester({prefix: '!'});

	t.true(customTest('!yo'));
	t.false(customTest('$yo'));
});

test('fn.matcher()', t => {
	const res = fn.matcher()('$some $stuff');

	t.same(res, ['some', 'stuff']);
});
