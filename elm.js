(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}



// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}




var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $krisajenkins$remotedata$RemoteData$Loading = {$: 'Loading'};
var $author$project$Main$MainPage = {$: 'MainPage'};
var $author$project$Main$GetLibraryFailure = function (a) {
	return {$: 'GetLibraryFailure', a: a};
};
var $author$project$Main$GetLibrarySuccess = function (a) {
	return {$: 'GetLibrarySuccess', a: a};
};
var $author$project$Main$expectLibrary = function (result) {
	if (result.$ === 'Ok') {
		var content = result.a;
		return $author$project$Main$GetLibrarySuccess(content);
	} else {
		var error = result.a;
		return $author$project$Main$GetLibraryFailure(error);
	}
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectString = function (toMsg) {
	return A2(
		$elm$http$Http$expectStringResponse,
		toMsg,
		$elm$http$Http$resolve($elm$core$Result$Ok));
};
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$StaticText$blogEditorExampleText = '# Markdown editor with Paco Ŝako support\n\nThere are many details about Paco Ŝako that I would love to discuss. Having a way to write and share articles on Paco Ŝako online would greatly contribute this. In this editor you can use [Github flavored Markdown](https://guides.github.com/features/mastering-markdown/) to write articles on Paco Ŝako.\n\nWe have replaced code blocks with rendered Paco Ŝako positions. You can create positions in the editor and then create a blog post based on it.\n\n```\n.. R. .. RR .. .. QQ ..\n.. .. .. .. PB .. .P P.\n.. .. PP .. .. .N .. ..\nK. .. .P .. .P NP B. ..\nP. .. .. .. .P PP .. P.\n.R .. P. .. .. .. .K ..\nB. .P .. .. .. .. N. ..\n.. .. .. .. .N .. .. PB\n-\nN. .. .. .. .. .. .. .R\n.Q PP .. .. P. P. .. ..\n.. .. .P .. .. .K .. ..\n.. .. .. .. PP K. N. ..\n.. .. .P .. B. .B QP ..\nP. .P R. .R .. PN .. .P\n.P P. .. .. .. .. .. PB\n.. .. .. .. .. .. BN R.\n```';
var $author$project$Main$initialBlog = {text: $author$project$StaticText$blogEditorExampleText};
var $author$project$Main$DragOff = {$: 'DragOff'};
var $author$project$Main$MoveTool = {$: 'MoveTool'};
var $author$project$Main$NoInput = {$: 'NoInput'};
var $author$project$Sako$Pawn = {$: 'Pawn'};
var $author$project$Main$ShowNumbers = {$: 'ShowNumbers'};
var $author$project$Sako$White = {$: 'White'};
var $author$project$Sako$Bishop = {$: 'Bishop'};
var $author$project$Sako$Black = {$: 'Black'};
var $author$project$Sako$King = {$: 'King'};
var $author$project$Sako$Knight = {$: 'Knight'};
var $author$project$Sako$Queen = {$: 'Queen'};
var $author$project$Sako$Rock = {$: 'Rock'};
var $author$project$Main$Tile = F2(
	function (a, b) {
		return {$: 'Tile', a: a, b: b};
	});
var $author$project$Main$pacoPiece = F3(
	function (color, pieceType, position) {
		return {color: color, pieceType: pieceType, position: position};
	});
var $author$project$Main$initialPosition = {
	moveNumber: 0,
	pieces: _List_fromArray(
		[
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Rock,
			A2($author$project$Main$Tile, 0, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Knight,
			A2($author$project$Main$Tile, 1, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Bishop,
			A2($author$project$Main$Tile, 2, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Queen,
			A2($author$project$Main$Tile, 3, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$King,
			A2($author$project$Main$Tile, 4, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Bishop,
			A2($author$project$Main$Tile, 5, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Knight,
			A2($author$project$Main$Tile, 6, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Rock,
			A2($author$project$Main$Tile, 7, 0)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 0, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 1, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 2, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 3, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 4, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 5, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 6, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$White,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 7, 1)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 0, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 1, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 2, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 3, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 4, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 5, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 6, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Pawn,
			A2($author$project$Main$Tile, 7, 6)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Rock,
			A2($author$project$Main$Tile, 0, 7)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Knight,
			A2($author$project$Main$Tile, 1, 7)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Bishop,
			A2($author$project$Main$Tile, 2, 7)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Queen,
			A2($author$project$Main$Tile, 3, 7)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$King,
			A2($author$project$Main$Tile, 4, 7)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Bishop,
			A2($author$project$Main$Tile, 5, 7)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Knight,
			A2($author$project$Main$Tile, 6, 7)),
			A3(
			$author$project$Main$pacoPiece,
			$author$project$Sako$Black,
			$author$project$Sako$Rock,
			A2($author$project$Main$Tile, 7, 7))
		])
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Main$sizeDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (x, y) {
			return _Utils_Tuple2(x, y);
		}),
	A2($elm$json$Json$Decode$field, 'width', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$int));
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$parseWindowSize = function (value) {
	return A2(
		$elm$core$Result$withDefault,
		_Utils_Tuple2(100, 100),
		A2($elm$json$Json$Decode$decodeValue, $author$project$Main$sizeDecoder, value));
};
var $yotamDvir$elm_pivot$Pivot$Types$Pivot = F2(
	function (a, b) {
		return {$: 'Pivot', a: a, b: b};
	});
var $yotamDvir$elm_pivot$Pivot$Create$fromCons = F2(
	function (x, xs) {
		return A2(
			$yotamDvir$elm_pivot$Pivot$Types$Pivot,
			x,
			_Utils_Tuple2(_List_Nil, xs));
	});
var $yotamDvir$elm_pivot$Pivot$Create$singleton = function (x) {
	return A2($yotamDvir$elm_pivot$Pivot$Create$fromCons, x, _List_Nil);
};
var $yotamDvir$elm_pivot$Pivot$singleton = $yotamDvir$elm_pivot$Pivot$Create$singleton;
var $author$project$Main$initialEditor = function (flags) {
	return {
		createToolColor: $author$project$Sako$White,
		createToolType: $author$project$Sako$Pawn,
		deleteToolColor: $elm$core$Maybe$Nothing,
		drag: $author$project$Main$DragOff,
		game: $yotamDvir$elm_pivot$Pivot$singleton($author$project$Main$initialPosition),
		moveToolColor: $elm$core$Maybe$Nothing,
		pasteParsed: $author$project$Main$NoInput,
		tool: $author$project$Main$MoveTool,
		userPaste: '',
		viewMode: $author$project$Main$ShowNumbers,
		windowSize: $author$project$Main$parseWindowSize(flags)
	};
};
var $author$project$Pieces$blackPieceColor = {
	fill: _Utils_Tuple3(50, 50, 50),
	stroke: _Utils_Tuple3(0, 0, 0)
};
var $author$project$Pieces$whitePieceColor = {
	fill: _Utils_Tuple3(255, 255, 255),
	stroke: _Utils_Tuple3(0, 0, 0)
};
var $author$project$Pieces$defaultColorScheme = {black: $author$project$Pieces$blackPieceColor, white: $author$project$Pieces$whitePieceColor};
var $author$project$Main$initialTaco = {colorScheme: $author$project$Pieces$defaultColorScheme};
var $author$project$Main$init = function (flags) {
	return _Utils_Tuple2(
		{
			blog: $author$project$Main$initialBlog,
			editor: $author$project$Main$initialEditor(flags),
			exampleFile: $krisajenkins$remotedata$RemoteData$Loading,
			page: $author$project$Main$MainPage,
			taco: $author$project$Main$initialTaco
		},
		$elm$http$Http$get(
			{
				expect: $elm$http$Http$expectString($author$project$Main$expectLibrary),
				url: 'static/examples.txt'
			}));
};
var $author$project$Main$EditorMsgWrapper = function (a) {
	return {$: 'EditorMsgWrapper', a: a};
};
var $author$project$Main$KeyUp = function (a) {
	return {$: 'KeyUp', a: a};
};
var $author$project$Main$SvgReadyForDownload = function (a) {
	return {$: 'SvgReadyForDownload', a: a};
};
var $author$project$Main$WindowResize = F2(
	function (a, b) {
		return {$: 'WindowResize', a: a, b: b};
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Main$KeyStroke = F3(
	function (key, ctrlKey, altKey) {
		return {altKey: altKey, ctrlKey: ctrlKey, key: key};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$decodeKeyStroke = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$KeyStroke,
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool));
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $elm$browser$Browser$Events$Window = {$: 'Window'};
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		$elm$browser$Browser$Events$Window,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Ports$responseSvgNodeContent = _Platform_incomingPort('responseSvgNodeContent', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (_v0) {
	return A2(
		$elm$core$Platform$Sub$map,
		$author$project$Main$EditorMsgWrapper,
		$elm$core$Platform$Sub$batch(
			_List_fromArray(
				[
					$elm$browser$Browser$Events$onResize($author$project$Main$WindowResize),
					$elm$browser$Browser$Events$onKeyUp(
					A2($elm$json$Json$Decode$map, $author$project$Main$KeyUp, $author$project$Main$decodeKeyStroke)),
					$author$project$Ports$responseSvgNodeContent($author$project$Main$SvgReadyForDownload)
				])));
};
var $author$project$Main$EditorPage = {$: 'EditorPage'};
var $krisajenkins$remotedata$RemoteData$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Main$Reset = function (a) {
	return {$: 'Reset', a: a};
};
var $krisajenkins$remotedata$RemoteData$Success = function (a) {
	return {$: 'Success', a: a};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $author$project$Main$linebreak = $elm$parser$Parser$chompWhile(
	function (c) {
		return _Utils_eq(
			c,
			_Utils_chr('\n')) || _Utils_eq(
			c,
			_Utils_chr('\u000D'));
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Main$indexedMapNest2 = F2(
	function (f, ls) {
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, xs) {
					return A2(
						$elm$core$List$indexedMap,
						F2(
							function (j, x) {
								return A3(f, i, j, x);
							}),
						xs);
				}),
			ls);
	});
var $author$project$Main$tileAsPacoPiece = F3(
	function (row, col, tile) {
		var position = A2($author$project$Main$Tile, col, 7 - row);
		switch (tile.$) {
			case 'EmptyTile':
				return _List_Nil;
			case 'WhiteTile':
				var w = tile.a;
				return _List_fromArray(
					[
						{color: $author$project$Sako$White, pieceType: w, position: position}
					]);
			case 'BlackTile':
				var b = tile.a;
				return _List_fromArray(
					[
						{color: $author$project$Sako$Black, pieceType: b, position: position}
					]);
			default:
				var w = tile.a;
				var b = tile.b;
				return _List_fromArray(
					[
						{color: $author$project$Sako$White, pieceType: w, position: position},
						{color: $author$project$Sako$Black, pieceType: b, position: position}
					]);
		}
	});
var $author$project$Main$gridAsPacoPosition = function (tiles) {
	return {
		moveNumber: 0,
		pieces: $elm$core$List$concat(
			$elm$core$List$concat(
				A2($author$project$Main$indexedMapNest2, $author$project$Main$tileAsPacoPiece, tiles)))
	};
};
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 'Problem', a: a};
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$problem = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $author$project$Main$parseLengthEightCheck = function (list) {
	return ($elm$core$List$length(list) === 8) ? $elm$parser$Parser$succeed(list) : $elm$parser$Parser$problem('There must be 8 columns in each row.');
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$not = _Basics_not;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$Main$parseTypeChar = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$elm$core$Maybe$Just($author$project$Sako$Pawn)),
			$elm$parser$Parser$symbol('P')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$elm$core$Maybe$Just($author$project$Sako$Rock)),
			$elm$parser$Parser$symbol('R')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$elm$core$Maybe$Just($author$project$Sako$Knight)),
			$elm$parser$Parser$symbol('N')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$elm$core$Maybe$Just($author$project$Sako$Bishop)),
			$elm$parser$Parser$symbol('B')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$elm$core$Maybe$Just($author$project$Sako$Queen)),
			$elm$parser$Parser$symbol('Q')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$elm$core$Maybe$Just($author$project$Sako$King)),
			$elm$parser$Parser$symbol('K')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Maybe$Nothing),
			$elm$parser$Parser$symbol('.'))
		]));
var $author$project$Main$BlackTile = function (a) {
	return {$: 'BlackTile', a: a};
};
var $author$project$Main$EmptyTile = {$: 'EmptyTile'};
var $author$project$Main$PairTile = F2(
	function (a, b) {
		return {$: 'PairTile', a: a, b: b};
	});
var $author$project$Main$WhiteTile = function (a) {
	return {$: 'WhiteTile', a: a};
};
var $author$project$Main$tileFromMaybe = F2(
	function (white, black) {
		var _v0 = _Utils_Tuple2(white, black);
		if (_v0.a.$ === 'Nothing') {
			if (_v0.b.$ === 'Nothing') {
				var _v1 = _v0.a;
				var _v2 = _v0.b;
				return $author$project$Main$EmptyTile;
			} else {
				var _v4 = _v0.a;
				var b = _v0.b.a;
				return $author$project$Main$BlackTile(b);
			}
		} else {
			if (_v0.b.$ === 'Nothing') {
				var w = _v0.a.a;
				var _v3 = _v0.b;
				return $author$project$Main$WhiteTile(w);
			} else {
				var w = _v0.a.a;
				var b = _v0.b.a;
				return A2($author$project$Main$PairTile, w, b);
			}
		}
	});
var $author$project$Main$parseTile = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($author$project$Main$tileFromMaybe),
		$author$project$Main$parseTypeChar),
	$author$project$Main$parseTypeChar);
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (step.$ === 'Loop') {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $author$project$Main$sepBy = F2(
	function (content, separator) {
		var helper = function (ls) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed(
							function (tile) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, tile, ls));
							}),
						A2(
							$elm$parser$Parser$ignorer,
							content,
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										separator,
										$elm$parser$Parser$succeed(_Utils_Tuple0)
									])))),
						$elm$parser$Parser$succeed(
						$elm$parser$Parser$Done(ls))
					]));
		};
		return A2(
			$elm$parser$Parser$map,
			$elm$core$List$reverse,
			A2($elm$parser$Parser$loop, _List_Nil, helper));
	});
var $author$project$Main$parseRow = A2(
	$elm$parser$Parser$andThen,
	$author$project$Main$parseLengthEightCheck,
	A2(
		$author$project$Main$sepBy,
		$author$project$Main$parseTile,
		$elm$parser$Parser$symbol(' ')));
var $author$project$Main$parseGrid = A2(
	$elm$parser$Parser$andThen,
	$author$project$Main$parseLengthEightCheck,
	A2($author$project$Main$sepBy, $author$project$Main$parseRow, $author$project$Main$linebreak));
var $author$project$Main$parsePosition = A2($elm$parser$Parser$map, $author$project$Main$gridAsPacoPosition, $author$project$Main$parseGrid);
var $author$project$Main$parseLibrary = A2(
	$author$project$Main$sepBy,
	$author$project$Main$parsePosition,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$symbol('-'),
		$author$project$Main$linebreak));
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$Pieces$setBlack = F2(
	function (c, s) {
		return _Utils_update(
			s,
			{black: c});
	});
var $author$project$Main$setColorScheme = F2(
	function (colorScheme, taco) {
		return _Utils_update(
			taco,
			{colorScheme: colorScheme});
	});
var $author$project$Pieces$setWhite = F2(
	function (c, s) {
		return _Utils_update(
			s,
			{white: c});
	});
var $author$project$Main$updateBlogEditor = F2(
	function (msg, blog) {
		var newText = msg.a;
		return _Utils_Tuple2(
			_Utils_update(
				blog,
				{text: newText}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$GotBoardPosition = F2(
	function (a, b) {
		return {$: 'GotBoardPosition', a: a, b: b};
	});
var $author$project$Main$ParseError = function (a) {
	return {$: 'ParseError', a: a};
};
var $author$project$Main$ParseSuccess = function (a) {
	return {$: 'ParseSuccess', a: a};
};
var $yotamDvir$elm_pivot$Pivot$Modify$appendGoL = F2(
	function (val, _v0) {
		var c = _v0.a;
		var _v1 = _v0.b;
		var l = _v1.a;
		var r = _v1.b;
		return A2(
			$yotamDvir$elm_pivot$Pivot$Types$Pivot,
			val,
			_Utils_Tuple2(
				l,
				A2($elm$core$List$cons, c, r)));
	});
var $yotamDvir$elm_pivot$Pivot$Utilities$reverse = function (_v0) {
	var c = _v0.a;
	var _v1 = _v0.b;
	var l = _v1.a;
	var r = _v1.b;
	return A2(
		$yotamDvir$elm_pivot$Pivot$Types$Pivot,
		c,
		_Utils_Tuple2(r, l));
};
var $yotamDvir$elm_pivot$Pivot$Utilities$mirror = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		$yotamDvir$elm_pivot$Pivot$Utilities$reverse,
		A2($elm$core$Basics$composeR, f, $yotamDvir$elm_pivot$Pivot$Utilities$reverse));
};
var $yotamDvir$elm_pivot$Pivot$Modify$appendGoR = function (val) {
	return $yotamDvir$elm_pivot$Pivot$Utilities$mirror(
		$yotamDvir$elm_pivot$Pivot$Modify$appendGoL(val));
};
var $yotamDvir$elm_pivot$Pivot$appendGoR = $yotamDvir$elm_pivot$Pivot$Modify$appendGoR;
var $yotamDvir$elm_pivot$Pivot$Get$getC = function (_v0) {
	var c = _v0.a;
	return c;
};
var $yotamDvir$elm_pivot$Pivot$getC = $yotamDvir$elm_pivot$Pivot$Get$getC;
var $yotamDvir$elm_pivot$Pivot$Modify$setL = F2(
	function (l_, _v0) {
		var c = _v0.a;
		var _v1 = _v0.b;
		var l = _v1.a;
		var r = _v1.b;
		return A2(
			$yotamDvir$elm_pivot$Pivot$Types$Pivot,
			c,
			_Utils_Tuple2(
				$elm$core$List$reverse(l_),
				r));
	});
var $yotamDvir$elm_pivot$Pivot$Modify$setR = function (r_) {
	return $yotamDvir$elm_pivot$Pivot$Utilities$mirror(
		$yotamDvir$elm_pivot$Pivot$Modify$setL(r_));
};
var $yotamDvir$elm_pivot$Pivot$setR = $yotamDvir$elm_pivot$Pivot$Modify$setR;
var $author$project$Main$addHistoryState = F2(
	function (newState, p) {
		return _Utils_eq(
			$yotamDvir$elm_pivot$Pivot$getC(p),
			newState) ? p : A2(
			$yotamDvir$elm_pivot$Pivot$appendGoR,
			newState,
			A2($yotamDvir$elm_pivot$Pivot$setR, _List_Nil, p));
	});
var $yotamDvir$elm_pivot$Pivot$Position$goR = function (_v0) {
	var cx = _v0.a;
	var _v1 = _v0.b;
	var lt = _v1.a;
	var rt = _v1.b;
	if (!rt.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var hd = rt.a;
		var tl = rt.b;
		return $elm$core$Maybe$Just(
			A2(
				$yotamDvir$elm_pivot$Pivot$Types$Pivot,
				hd,
				_Utils_Tuple2(
					A2($elm$core$List$cons, cx, lt),
					tl)));
	}
};
var $yotamDvir$elm_pivot$Pivot$goR = $yotamDvir$elm_pivot$Pivot$Position$goR;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $yotamDvir$elm_pivot$Pivot$Utilities$withRollback = F2(
	function (f, x) {
		return A2(
			$elm$core$Maybe$withDefault,
			x,
			f(x));
	});
var $yotamDvir$elm_pivot$Pivot$withRollback = $yotamDvir$elm_pivot$Pivot$Utilities$withRollback;
var $author$project$Main$applyRedo = function (model) {
	return _Utils_update(
		model,
		{
			game: A2($yotamDvir$elm_pivot$Pivot$withRollback, $yotamDvir$elm_pivot$Pivot$goR, model.game)
		});
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $yotamDvir$elm_pivot$Pivot$Utilities$mirrorM = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		$yotamDvir$elm_pivot$Pivot$Utilities$reverse,
		A2(
			$elm$core$Basics$composeR,
			f,
			$elm$core$Maybe$map($yotamDvir$elm_pivot$Pivot$Utilities$reverse)));
};
var $yotamDvir$elm_pivot$Pivot$Position$goL = $yotamDvir$elm_pivot$Pivot$Utilities$mirrorM($yotamDvir$elm_pivot$Pivot$Position$goR);
var $yotamDvir$elm_pivot$Pivot$goL = $yotamDvir$elm_pivot$Pivot$Position$goL;
var $author$project$Main$applyUndo = function (model) {
	return _Utils_update(
		model,
		{
			game: A2($yotamDvir$elm_pivot$Pivot$withRollback, $yotamDvir$elm_pivot$Pivot$goL, model.game)
		});
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$Main$createToolRelease = F3(
	function (down, up, model) {
		var oldPosition = $yotamDvir$elm_pivot$Pivot$getC(model.game);
		var spaceOccupied = A2(
			$elm$core$List$any,
			function (p) {
				return _Utils_eq(p.color, model.createToolColor) && _Utils_eq(p.position, up);
			},
			oldPosition.pieces);
		var newPiece = {color: model.createToolColor, pieceType: model.createToolType, position: up};
		var newPosition = function (_v1) {
			return _Utils_update(
				oldPosition,
				{
					pieces: A2($elm$core$List$cons, newPiece, oldPosition.pieces)
				});
		};
		var newHistory = function (_v0) {
			return A2(
				$author$project$Main$addHistoryState,
				newPosition(_Utils_Tuple0),
				model.game);
		};
		return (_Utils_eq(up, down) && (!spaceOccupied)) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{
					game: newHistory(_Utils_Tuple0)
				}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$colorFilter = F2(
	function (color, piece) {
		if (color.$ === 'Just') {
			var c = color.a;
			return _Utils_eq(piece.color, c);
		} else {
			return true;
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$deleteToolRelease = F3(
	function (down, up, model) {
		var oldPosition = $yotamDvir$elm_pivot$Pivot$getC(model.game);
		var pieces = A2(
			$elm$core$List$filter,
			function (p) {
				return (!_Utils_eq(p.position, up)) || (!A2($author$project$Main$colorFilter, model.deleteToolColor, p));
			},
			oldPosition.pieces);
		var newHistory = A2(
			$author$project$Main$addHistoryState,
			_Utils_update(
				oldPosition,
				{pieces: pieces}),
			model.game);
		return _Utils_eq(up, down) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{game: newHistory}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm_community$list_extra$List$Extra$count = function (predicate) {
	return A2(
		$elm$core$List$foldl,
		F2(
			function (x, acc) {
				return predicate(x) ? (acc + 1) : acc;
			}),
		0);
};
var $author$project$Main$moveToolRelease = F3(
	function (down, up, model) {
		var oldPosition = $yotamDvir$elm_pivot$Pivot$getC(model.game);
		var moveAction = function (piece) {
			return (_Utils_eq(piece.position, down) && A2($author$project$Main$colorFilter, model.moveToolColor, piece)) ? _Utils_update(
				piece,
				{position: up}) : piece;
		};
		var newPosition = function (_v2) {
			return _Utils_update(
				oldPosition,
				{
					pieces: A2($elm$core$List$map, moveAction, oldPosition.pieces)
				});
		};
		var newHistory = function (_v1) {
			return A2(
				$author$project$Main$addHistoryState,
				newPosition(_Utils_Tuple0),
				model.game);
		};
		var involvedPieces = A2(
			$elm$core$List$filter,
			function (p) {
				return (_Utils_eq(p.position, down) || _Utils_eq(p.position, up)) && A2($author$project$Main$colorFilter, model.moveToolColor, p);
			},
			oldPosition.pieces);
		var _v0 = _Utils_Tuple2(
			A2(
				$elm_community$list_extra$List$Extra$count,
				function (p) {
					return _Utils_eq(p.color, $author$project$Sako$White);
				},
				involvedPieces),
			A2(
				$elm_community$list_extra$List$Extra$count,
				function (p) {
					return _Utils_eq(p.color, $author$project$Sako$Black);
				},
				involvedPieces));
		var whiteCount = _v0.a;
		var blackCount = _v0.b;
		return ((whiteCount <= 1) && (blackCount <= 1)) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{
					game: newHistory(_Utils_Tuple0)
				}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$tileCoordinate = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return A2($author$project$Main$Tile, (x / 100) | 0, 7 - ((y / 100) | 0));
};
var $author$project$Main$clickRelease = F3(
	function (down, up, model) {
		var _v0 = model.tool;
		switch (_v0.$) {
			case 'DeleteTool':
				return A3(
					$author$project$Main$deleteToolRelease,
					$author$project$Main$tileCoordinate(down),
					$author$project$Main$tileCoordinate(up),
					model);
			case 'MoveTool':
				return A3(
					$author$project$Main$moveToolRelease,
					$author$project$Main$tileCoordinate(down),
					$author$project$Main$tileCoordinate(up),
					model);
			default:
				return A3(
					$author$project$Main$createToolRelease,
					$author$project$Main$tileCoordinate(down),
					$author$project$Main$tileCoordinate(up),
					model);
		}
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$encodeDownloadRequest = function (record) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'svgNode',
				$elm$json$Json$Encode$string(record.svgNode)),
				_Utils_Tuple2(
				'outputWidth',
				$elm$json$Json$Encode$int(record.outputWidth)),
				_Utils_Tuple2(
				'outputHeight',
				$elm$json$Json$Encode$int(record.outputHeight))
			]));
};
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$Main$ctrlKeyUp = F2(
	function (key, model) {
		switch (key) {
			case 'z':
				return _Utils_Tuple2(
					$author$project$Main$applyUndo(model),
					$elm$core$Platform$Cmd$none);
			case 'y':
				return _Utils_Tuple2(
					$author$project$Main$applyRedo(model),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$keyUp = F2(
	function (stroke, model) {
		return (stroke.ctrlKey && (!stroke.altKey)) ? A2($author$project$Main$ctrlKeyUp, stroke.key, model) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$Dragging = function (a) {
	return {$: 'Dragging', a: a};
};
var $author$project$Main$SvgCoord = F2(
	function (a, b) {
		return {$: 'SvgCoord', a: a, b: b};
	});
var $author$project$Main$absoluteOutside = F2(
	function (rect, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2((x * rect.width) + rect.x, (y * rect.height) + rect.y);
	});
var $author$project$Main$relativeInside = F2(
	function (rect, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2((x - rect.x) / rect.width, (y - rect.y) / rect.height);
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Main$roundTuple = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return _Utils_Tuple2(
		$elm$core$Basics$round(x),
		$elm$core$Basics$round(y));
};
var $author$project$Main$gameSpaceCoordinate = F3(
	function (elementRect, gameView, coord) {
		return function (_v0) {
			var x = _v0.a;
			var y = _v0.b;
			return A2($author$project$Main$SvgCoord, x, y);
		}(
			$author$project$Main$roundTuple(
				A2(
					$author$project$Main$absoluteOutside,
					gameView,
					A2($author$project$Main$relativeInside, elementRect, coord))));
	});
var $author$project$Main$boardViewBox = function (viewMode) {
	if (viewMode.$ === 'ShowNumbers') {
		return {height: 920, width: 900, x: -70, y: -30};
	} else {
		return {height: 860, width: 860, x: -30, y: -30};
	}
};
var $author$project$Main$realizedBoardViewBox = function (viewMode) {
	var rect = $author$project$Main$boardViewBox(viewMode);
	return _Utils_update(
		rect,
		{width: rect.height, x: rect.x - ((rect.height - rect.width) / 2)});
};
var $author$project$Main$moveDrag = F2(
	function (event, drag) {
		if (drag.$ === 'DragOff') {
			return $author$project$Main$DragOff;
		} else {
			var start = drag.a.start;
			var rect = drag.a.rect;
			return $author$project$Main$Dragging(
				{
					current: A3(
						$author$project$Main$gameSpaceCoordinate,
						rect,
						$author$project$Main$realizedBoardViewBox($author$project$Main$ShowNumbers),
						event.clientPos),
					rect: rect,
					start: start
				});
		}
	});
var $author$project$Ports$requestSvgNodeContent = _Platform_outgoingPort('requestSvgNodeContent', $elm$json$Json$Encode$string);
var $author$project$Main$sakoEditorId = 'sako-editor';
var $author$project$Main$startDrag = F2(
	function (element, event) {
		var start = A3(
			$author$project$Main$gameSpaceCoordinate,
			element,
			$author$project$Main$realizedBoardViewBox($author$project$Main$ShowNumbers),
			event.clientPos);
		return $author$project$Main$Dragging(
			{current: start, rect: element, start: start});
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$file$File$Download$string = F3(
	function (name, mime, content) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$never,
			A3(_File_download, name, mime, content));
	});
var $author$project$Ports$triggerPngDownload = _Platform_outgoingPort('triggerPngDownload', $elm$core$Basics$identity);
var $author$project$Main$updateEditor = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NoOp':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'MouseDown':
				var event = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						function (res) {
							return A2($author$project$Main$GotBoardPosition, res, event);
						},
						$elm$browser$Browser$Dom$getElement('boardDiv')));
			case 'MouseMove':
				var event = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							drag: A2($author$project$Main$moveDrag, event, model.drag)
						}),
					$elm$core$Platform$Cmd$none);
			case 'MouseUp':
				var event = msg.a;
				var drag = A2($author$project$Main$moveDrag, event, model.drag);
				if (drag.$ === 'DragOff') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{drag: $author$project$Main$DragOff}),
						$elm$core$Platform$Cmd$none);
				} else {
					var dragData = drag.a;
					return A3(
						$author$project$Main$clickRelease,
						dragData.start,
						dragData.current,
						_Utils_update(
							model,
							{drag: $author$project$Main$DragOff}));
				}
			case 'GotBoardPosition':
				var res = msg.a;
				var event = msg.b;
				if (res.$ === 'Ok') {
					var element = res.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								drag: A2($author$project$Main$startDrag, element.element, event)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'WindowResize':
				var width = msg.a;
				var height = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							windowSize: _Utils_Tuple2(width, height)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ToolSelect':
				var tool = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{tool: tool}),
					$elm$core$Platform$Cmd$none);
			case 'MoveToolFilter':
				var newColor = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{moveToolColor: newColor}),
					$elm$core$Platform$Cmd$none);
			case 'DeleteToolFilter':
				var newColor = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{deleteToolColor: newColor}),
					$elm$core$Platform$Cmd$none);
			case 'CreateToolColor':
				var newColor = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{createToolColor: newColor}),
					$elm$core$Platform$Cmd$none);
			case 'CreateToolType':
				var newType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{createToolType: newType}),
					$elm$core$Platform$Cmd$none);
			case 'Undo':
				return _Utils_Tuple2(
					$author$project$Main$applyUndo(model),
					$elm$core$Platform$Cmd$none);
			case 'Redo':
				return _Utils_Tuple2(
					$author$project$Main$applyRedo(model),
					$elm$core$Platform$Cmd$none);
			case 'Reset':
				var newPosition = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							game: A2($author$project$Main$addHistoryState, newPosition, model.game)
						}),
					$elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var stroke = msg.a;
				return A2($author$project$Main$keyUp, stroke, model);
			case 'DownloadSvg':
				return _Utils_Tuple2(
					model,
					$author$project$Ports$requestSvgNodeContent($author$project$Main$sakoEditorId));
			case 'DownloadPng':
				return _Utils_Tuple2(
					model,
					$author$project$Ports$triggerPngDownload(
						$author$project$Main$encodeDownloadRequest(
							{outputHeight: 1000, outputWidth: 1000, svgNode: $author$project$Main$sakoEditorId})));
			case 'SvgReadyForDownload':
				var fileContent = msg.a;
				return _Utils_Tuple2(
					model,
					A3($elm$file$File$Download$string, 'pacoSako.svg', 'image/svg+xml', fileContent));
			case 'UpdateUserPaste':
				var pasteContent = msg.a;
				var parseInput = function (_v4) {
					var _v3 = A2($elm$parser$Parser$run, $author$project$Main$parsePosition, pasteContent);
					if (_v3.$ === 'Err') {
						return $author$project$Main$ParseError('Error: Make sure your input has the right shape!');
					} else {
						var position = _v3.a;
						return $author$project$Main$ParseSuccess(position);
					}
				};
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							pasteParsed: $elm$core$String$isEmpty(pasteContent) ? $author$project$Main$NoInput : parseInput(_Utils_Tuple0),
							userPaste: pasteContent
						}),
					$elm$core$Platform$Cmd$none);
			case 'UseUserPaste':
				var newPosition = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							game: A2($author$project$Main$addHistoryState, newPosition, model.game)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var newViewMode = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{viewMode: newViewMode}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'EditorMsgWrapper':
				var editorMsg = msg.a;
				var _v1 = A2($author$project$Main$updateEditor, editorMsg, model.editor);
				var editorModel = _v1.a;
				var editorCmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{editor: editorModel}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$EditorMsgWrapper, editorCmd));
			case 'BlogMsgWrapper':
				var blogEditorMsg = msg.a;
				var _v2 = A2($author$project$Main$updateBlogEditor, blogEditorMsg, model.blog);
				var blogEditorModel = _v2.a;
				var blogEditorCmd = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{blog: blogEditorModel}),
					blogEditorCmd);
			case 'LoadIntoEditor':
				var newPosition = msg.a;
				var _v3 = A2(
					$author$project$Main$updateEditor,
					$author$project$Main$Reset(newPosition),
					model.editor);
				var editorModel = _v3.a;
				var editorCmd = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{editor: editorModel, page: $author$project$Main$EditorPage}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$EditorMsgWrapper, editorCmd));
			case 'WhiteSideColor':
				var newSideColor = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							taco: A2(
								$author$project$Main$setColorScheme,
								A2($author$project$Pieces$setWhite, newSideColor, model.taco.colorScheme),
								model.taco)
						}),
					$elm$core$Platform$Cmd$none);
			case 'BlackSideColor':
				var newSideColor = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							taco: A2(
								$author$project$Main$setColorScheme,
								A2($author$project$Pieces$setBlack, newSideColor, model.taco.colorScheme),
								model.taco)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GetLibrarySuccess':
				var content = msg.a;
				var examples = function () {
					var _v4 = A2($elm$parser$Parser$run, $author$project$Main$parseLibrary, content);
					if (_v4.$ === 'Err') {
						return $krisajenkins$remotedata$RemoteData$Failure(
							$elm$http$Http$BadBody('The examples file is broken'));
					} else {
						var positions = _v4.a;
						return $krisajenkins$remotedata$RemoteData$Success(positions);
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{exampleFile: examples}),
					$elm$core$Platform$Cmd$none);
			case 'GetLibraryFailure':
				var error = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							exampleFile: $krisajenkins$remotedata$RemoteData$Failure(error)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var newPage = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{page: newPage}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$BlogMsgWrapper = function (a) {
	return {$: 'BlogMsgWrapper', a: a};
};
var $author$project$Main$BlogPage = {$: 'BlogPage'};
var $author$project$Main$OnMarkdownInput = function (a) {
	return {$: 'OnMarkdownInput', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 'AlignX', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = {$: 'CenterX'};
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX($mdgriffith$elm_ui$Internal$Model$CenterX);
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 'Unkeyed', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsColumn = {$: 'AsColumn'};
var $mdgriffith$elm_ui$Internal$Model$asColumn = $mdgriffith$elm_ui$Internal$Model$AsColumn;
var $mdgriffith$elm_ui$Internal$Style$classes = {above: 'a', active: 'atv', alignBottom: 'ab', alignCenterX: 'cx', alignCenterY: 'cy', alignContainerBottom: 'acb', alignContainerCenterX: 'accx', alignContainerCenterY: 'accy', alignContainerRight: 'acr', alignLeft: 'al', alignRight: 'ar', alignTop: 'at', alignedHorizontally: 'ah', alignedVertically: 'av', any: 's', behind: 'bh', below: 'b', bold: 'w7', borderDashed: 'bd', borderDotted: 'bdt', borderNone: 'bn', borderSolid: 'bs', capturePointerEvents: 'cpe', clip: 'cp', clipX: 'cpx', clipY: 'cpy', column: 'c', container: 'ctr', contentBottom: 'cb', contentCenterX: 'ccx', contentCenterY: 'ccy', contentLeft: 'cl', contentRight: 'cr', contentTop: 'ct', cursorPointer: 'cptr', cursorText: 'ctxt', focus: 'fcs', focusedWithin: 'focus-within', fullSize: 'fs', grid: 'g', hasBehind: 'hbh', heightContent: 'hc', heightExact: 'he', heightFill: 'hf', heightFillPortion: 'hfp', hover: 'hv', imageContainer: 'ic', inFront: 'fr', inputMultiline: 'iml', inputMultilineFiller: 'imlf', inputMultilineParent: 'imlp', inputMultilineWrapper: 'implw', inputText: 'it', italic: 'i', link: 'lnk', nearby: 'nb', noTextSelection: 'notxt', onLeft: 'ol', onRight: 'or', opaque: 'oq', overflowHidden: 'oh', page: 'pg', paragraph: 'p', passPointerEvents: 'ppe', root: 'ui', row: 'r', scrollbars: 'sb', scrollbarsX: 'sbx', scrollbarsY: 'sby', seButton: 'sbt', single: 'e', sizeByCapital: 'cap', spaceEvenly: 'sev', strike: 'sk', text: 't', textCenter: 'tc', textExtraBold: 'w8', textExtraLight: 'w2', textHeavy: 'w9', textJustify: 'tj', textJustifyAll: 'tja', textLeft: 'tl', textLight: 'w3', textMedium: 'w5', textNormalWeight: 'w4', textRight: 'tr', textSemiBold: 'w6', textThin: 'w1', textUnitalicized: 'tun', transition: 'ts', transparent: 'clr', underline: 'u', widthContent: 'wc', widthExact: 'we', widthFill: 'wf', widthFillPortion: 'wfp', wrapped: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 'Generic'};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 'NoNearbyChildren'};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.column);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.grid);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.page);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.paragraph);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.row);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.single);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context.$) {
		case 'AsRow':
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 'AsColumn':
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 'AsEl':
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 'AsGrid':
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 'AsParagraph':
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 'Keyed', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 'NoStyleSheet'};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 'Styled', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 'Unstyled', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 'NoNearbyChildren':
				return existing;
			case 'ChildrenBehind':
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 'ChildrenInFront':
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 'NoNearbyChildren':
				return existing;
			case 'ChildrenBehind':
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 'ChildrenInFront':
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsEl = {$: 'AsEl'};
var $mdgriffith$elm_ui$Internal$Model$asEl = $mdgriffith$elm_ui$Internal$Model$AsEl;
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = {$: 'AsParagraph'};
var $mdgriffith$elm_ui$Internal$Model$asParagraph = $mdgriffith$elm_ui$Internal$Model$AsParagraph;
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 'Flag', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 'Second', a: a};
};
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 'Px':
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 'Content':
			return 'auto';
		case 'Fill':
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 'Min':
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 'Untransformed':
			return $elm$core$Maybe$Nothing;
		case 'Moved':
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 'Shadows':
			var name = style.a;
			return name;
		case 'Transparency':
			var name = style.a;
			var o = style.b;
			return name;
		case 'Style':
			var _class = style.a;
			return _class;
		case 'FontFamily':
			var name = style.a;
			return name;
		case 'FontSize':
			var i = style.a;
			return 'font-size-' + $elm$core$String$fromInt(i);
		case 'Single':
			var _class = style.a;
			return _class;
		case 'Colored':
			var _class = style.a;
			return _class;
		case 'SpacingStyle':
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 'PaddingStyle':
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 'BorderWidth':
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 'GridTemplateStyle':
			var template = style.a;
			return 'grid-rows-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.rows)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.columns)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.b)))))));
		case 'GridPosition':
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.row) + ('-' + ($elm$core$String$fromInt(pos.col) + ('-' + ($elm$core$String$fromInt(pos.width) + ('-' + $elm$core$String$fromInt(pos.height)))))));
		case 'PseudoSelector':
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector.$) {
					case 'Focus':
						return 'fs';
					case 'Hover':
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 'Property', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 'Style', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.inset ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.offset.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.offset.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.blur) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.size) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.color))
				])));
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.focusedWithin) + ':focus-within',
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.borderColor),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.backgroundColor),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										blur: shadow.blur,
										color: shadow.color,
										inset: false,
										offset: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.offset)),
										size: shadow.size
									}));
						},
						focus.shadow),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					]))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + (':focus .focusable, ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + '.focusable:focus')),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.borderColor),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.backgroundColor),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										blur: shadow.blur,
										color: shadow.color,
										inset: false,
										offset: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.offset)),
										size: shadow.size
									}));
						},
						focus.shadow),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					])))
		]);
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 'Batch', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 'Child', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 'Class', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 'Descriptor', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = {$: 'Left'};
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 'Prop', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = {$: 'Right'};
var $mdgriffith$elm_ui$Internal$Style$Self = function (a) {
	return {$: 'Self', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 'Supports', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = function (a) {
	return {$: 'Content', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Bottom = {$: 'Bottom'};
var $mdgriffith$elm_ui$Internal$Style$CenterX = {$: 'CenterX'};
var $mdgriffith$elm_ui$Internal$Style$CenterY = {$: 'CenterY'};
var $mdgriffith$elm_ui$Internal$Style$Top = {$: 'Top'};
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[$mdgriffith$elm_ui$Internal$Style$Top, $mdgriffith$elm_ui$Internal$Style$Bottom, $mdgriffith$elm_ui$Internal$Style$Right, $mdgriffith$elm_ui$Internal$Style$Left, $mdgriffith$elm_ui$Internal$Style$CenterX, $mdgriffith$elm_ui$Internal$Style$CenterY]);
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc.a.$) {
		case 'Top':
			var _v1 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentTop);
		case 'Bottom':
			var _v2 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentBottom);
		case 'Right':
			var _v3 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentRight);
		case 'Left':
			var _v4 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentLeft);
		case 'CenterX':
			var _v5 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentCenterX);
		default:
			var _v6 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc.a.$) {
		case 'Top':
			var _v1 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignTop);
		case 'Bottom':
			var _v2 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignBottom);
		case 'Right':
			var _v3 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignRight);
		case 'Left':
			var _v4 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignLeft);
		case 'CenterX':
			var _v5 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterX);
		default:
			var _v6 = desc.a;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(
					$mdgriffith$elm_ui$Internal$Style$Content(alignment)),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(
							$mdgriffith$elm_ui$Internal$Style$Self(alignment)),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hasBehind),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.seButton),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightContent),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthContent),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment.$) {
				case 'Top':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 'Bottom':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 'Right':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 'Left':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 'CenterX':
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(
							$mdgriffith$elm_ui$Internal$Style$Self(alignment)),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = {$: 'Above'};
var $mdgriffith$elm_ui$Internal$Style$Behind = {$: 'Behind'};
var $mdgriffith$elm_ui$Internal$Style$Below = {$: 'Below'};
var $mdgriffith$elm_ui$Internal$Style$OnLeft = {$: 'OnLeft'};
var $mdgriffith$elm_ui$Internal$Style$OnRight = {$: 'OnRight'};
var $mdgriffith$elm_ui$Internal$Style$Within = {$: 'Within'};
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = $mdgriffith$elm_ui$Internal$Style$Above;
	var _v0 = function () {
		switch (loc.$) {
			case 'Above':
				return _Utils_Tuple0;
			case 'Below':
				return _Utils_Tuple0;
			case 'OnRight':
				return _Utils_Tuple0;
			case 'OnLeft':
				return _Utils_Tuple0;
			case 'Within':
				return _Utils_Tuple0;
			default:
				return _Utils_Tuple0;
		}
	}();
	return _List_fromArray(
		[$mdgriffith$elm_ui$Internal$Style$Above, $mdgriffith$elm_ui$Internal$Style$Below, $mdgriffith$elm_ui$Internal$Style$OnRight, $mdgriffith$elm_ui$Internal$Style$OnLeft, $mdgriffith$elm_ui$Internal$Style$Within, $mdgriffith$elm_ui$Internal$Style$Behind]);
}();
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.imageContainer))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.root),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inFront),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nearby),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nearby),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc.$) {
							case 'Above':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.above),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 'Below':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.below),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 'OnRight':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onRight),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 'OnLeft':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onLeft),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 'Within':
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inFront),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wrapped),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.noTextSelection),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cursorPointer),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cursorText),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.passPointerEvents),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.capturePointerEvents),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.transparent),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.opaque),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.hover, $mdgriffith$elm_ui$Internal$Style$classes.transparent)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.hover, $mdgriffith$elm_ui$Internal$Style$classes.opaque)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.focus, $mdgriffith$elm_ui$Internal$Style$classes.transparent)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.focus, $mdgriffith$elm_ui$Internal$Style$classes.opaque)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.active, $mdgriffith$elm_ui$Internal$Style$classes.transparent)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.active, $mdgriffith$elm_ui$Internal$Style$classes.opaque)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.transition),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.scrollbars),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.scrollbarsX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.scrollbarsY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.column),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.clip),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.clipX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.clipY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthContent),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderNone),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderDashed),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderDotted),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.borderSolid),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputText),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthExact),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.link),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFillPortion),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.container),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerRight,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterX),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterX),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerRight + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 'Bottom':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 'Right':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 'Left':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 'CenterX':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.spaceEvenly),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.column),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightExact),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.column),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.heightFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFill),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthFillPortion),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.widthContent),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerBottom,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.alignCenterY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.alignContainerBottom + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 'Bottom':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 'Right':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 'Left':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 'CenterX':
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.container),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.spaceEvenly),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.grid),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 'Bottom':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 'Right':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 'Left':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 'CenterX':
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.page),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.any + ($mdgriffith$elm_ui$Internal$Style$selfName(
								$mdgriffith$elm_ui$Internal$Style$Self($mdgriffith$elm_ui$Internal$Style$Left)) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.any))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.any + ($mdgriffith$elm_ui$Internal$Style$selfName(
								$mdgriffith$elm_ui$Internal$Style$Self($mdgriffith$elm_ui$Internal$Style$Right)) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.any))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Bottom':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Right':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 'Left':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 'CenterX':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultiline),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background-color', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineWrapper),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineParent),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineFiller),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'transparent')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.paragraph),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hasBehind),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.inFront),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.behind),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.above),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.below),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onRight),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.onLeft),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.single),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Internal$Style$Child,
										$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.text),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
											]))
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.column),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.grid),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment.$) {
								case 'Top':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Bottom':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 'Right':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 'Left':
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 'CenterX':
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textThin),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textExtraLight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textLight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textNormalWeight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textMedium),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textSemiBold),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bold),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textExtraBold),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textHeavy),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.italic),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.strike),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.underline),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.underline),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.strike)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textUnitalicized),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textJustify),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textJustifyAll),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textCenter),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textRight),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.textLeft),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.any + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.any + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$inputTextReset = '\ninput[type="search"],\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$sliderReset = '\ninput[type=range] {\n  -webkit-appearance: none; \n  background: transparent;\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$thumbReset = '\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$trackReset = '\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.row) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.any) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.container) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$inputTextReset + ($mdgriffith$elm_ui$Internal$Style$sliderReset + ($mdgriffith$elm_ui$Internal$Style$trackReset + ($mdgriffith$elm_ui$Internal$Style$thumbReset + $mdgriffith$elm_ui$Internal$Style$explainer)))))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = function (a) {
	return {$: 'Intermediate', a: a};
};
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return $mdgriffith$elm_ui$Internal$Style$Intermediate(
			{closing: closing, others: _List_Nil, props: _List_Nil, selector: selector});
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0.a;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 'Prop':
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								props: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.props)
							});
					case 'Supports':
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Style$Intermediate(
										{closing: '\n}', others: _List_Nil, props: props, selector: '@supports (' + (prop + (':' + (value + (') {' + parent.selector))))}),
									rendered.others)
							});
					case 'Adjacent':
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.selector + (' + ' + selector), ''),
										adjRules),
									rendered.others)
							});
					case 'Child':
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.selector + (' > ' + child), ''),
										childRules),
									rendered.others)
							});
					case 'Descriptor':
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.selector, descriptor),
											''),
										descriptorRules),
									rendered.others)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								others: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.selector, ''),
										batched),
									rendered.others)
							});
				}
			});
		return $mdgriffith$elm_ui$Internal$Style$Intermediate(
			A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender));
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.props;
		if (!_v2.b) {
			return '';
		} else {
			return rule.selector + ('{' + (renderValues(rule.props) + (rule.closing + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0.a;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.others)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $mdgriffith$elm_ui$Internal$Model$staticRoot = function (opts) {
	var _v0 = opts.mode;
	switch (_v0.$) {
		case 'Layout':
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'style',
				_List_Nil,
				_List_fromArray(
					[
						$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
					]));
		case 'NoStaticStyleSheet':
			return $elm$virtual_dom$VirtualDom$text('');
		default:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'elm-ui-static-rules',
				_List_fromArray(
					[
						A2(
						$elm$virtual_dom$VirtualDom$property,
						'rules',
						$elm$json$Json$Encode$string($mdgriffith$elm_ui$Internal$Style$rules))
					]),
				_List_Nil);
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 'Serif':
			return 'serif';
		case 'SansSerif':
			return 'sans-serif';
		case 'Monospace':
			return 'monospace';
		case 'Typeface':
			var name = font.a;
			return '\"' + (name + '\"');
		case 'ImportFont':
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.name;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 'VariantActive':
			var name = _var.a;
			return name === 'smcp';
		case 'VariantOff':
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 'FontWith') {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.variants);
	} else {
		return false;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$renderStyle = F4(
	function (options, maybePseudo, selector, props) {
		if (maybePseudo.$ === 'Nothing') {
			return _List_fromArray(
				[
					selector + ('{' + (A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$renderProps(false),
					'',
					props) + '\n}'))
				]);
		} else {
			var pseudo = maybePseudo.a;
			switch (pseudo.$) {
				case 'Hover':
					var _v2 = options.hover;
					switch (_v2.$) {
						case 'NoHover':
							return _List_Nil;
						case 'ForceHover':
							return _List_fromArray(
								[
									selector + ('-hv {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(true),
									'',
									props) + '\n}'))
								]);
						default:
							return _List_fromArray(
								[
									selector + ('-hv:hover {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(false),
									'',
									props) + '\n}'))
								]);
					}
				case 'Focus':
					var renderedProps = A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props);
					return _List_fromArray(
						[selector + ('-fs:focus {' + (renderedProps + '\n}')), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.any + (':focus ~ ' + (selector + ('-fs:not(.focus)  {' + (renderedProps + '\n}'))))), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.any + (':focus ' + (selector + ('-fs  {' + (renderedProps + '\n}'))))), '.focusable-parent:focus ~ ' + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + (selector + ('-fs {' + (renderedProps + '\n}'))))))]);
				default:
					return _List_fromArray(
						[
							selector + ('-act:active {' + (A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$renderProps(false),
							'',
							props) + '\n}'))
						]);
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 'VariantActive':
			var name = _var.a;
			return '\"' + (name + '\"');
		case 'VariantOff':
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 'FontWith') {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.variants)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 'Untransformed':
			return $elm$core$Maybe$Nothing;
		case 'Moved':
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderStyleRule = F3(
	function (options, rule, maybePseudo) {
		switch (rule.$) {
			case 'Style':
				var selector = rule.a;
				var props = rule.b;
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, selector, props);
			case 'Shadows':
				var name = rule.a;
				var prop = rule.b;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
						]));
			case 'Transparency':
				var name = rule.a;
				var transparency = rule.b;
				var opacity = A2(
					$elm$core$Basics$max,
					0,
					A2($elm$core$Basics$min, 1, 1 - transparency));
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'opacity',
							$elm$core$String$fromFloat(opacity))
						]));
			case 'FontSize':
				var i = rule.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			case 'FontFamily':
				var name = rule.a;
				var typefaces = rule.b;
				var features = A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
				var families = _List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-family',
						A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-variant',
						A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
					]);
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, '.' + name, families);
			case 'Single':
				var _class = rule.a;
				var prop = rule.b;
				var val = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
						]));
			case 'Colored':
				var _class = rule.a;
				var prop = rule.b;
				var color = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							prop,
							$mdgriffith$elm_ui$Internal$Model$formatColor(color))
						]));
			case 'SpacingStyle':
				var cls = rule.a;
				var x = rule.b;
				var y = rule.c;
				var yPx = $elm$core$String$fromInt(y) + 'px';
				var xPx = $elm$core$String$fromInt(x) + 'px';
				var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.single;
				var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.row;
				var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.wrapped + row);
				var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.alignRight;
				var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.paragraph;
				var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.page;
				var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.alignLeft;
				var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
				var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
				var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.column;
				var _class = '.' + cls;
				var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.any;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (row + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (wrappedRow + (' > ' + any)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (column + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_Utils_ap(_class, paragraph),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							'textarea' + (any + _class),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)')),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'height',
									'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::after'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-top',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::before'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-bottom',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								]))
						]));
			case 'PaddingStyle':
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'padding',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 'BorderWidth':
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-width',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 'GridTemplateStyle':
				var template = rule.a;
				var toGridLengthHelper = F3(
					function (minimum, maximum, x) {
						toGridLengthHelper:
						while (true) {
							switch (x.$) {
								case 'Px':
									var px = x.a;
									return $elm$core$String$fromInt(px) + 'px';
								case 'Content':
									var _v2 = _Utils_Tuple2(minimum, maximum);
									if (_v2.a.$ === 'Nothing') {
										if (_v2.b.$ === 'Nothing') {
											var _v3 = _v2.a;
											var _v4 = _v2.b;
											return 'max-content';
										} else {
											var _v6 = _v2.a;
											var maxSize = _v2.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v2.b.$ === 'Nothing') {
											var minSize = _v2.a.a;
											var _v5 = _v2.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
										} else {
											var minSize = _v2.a.a;
											var maxSize = _v2.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 'Fill':
									var i = x.a;
									var _v7 = _Utils_Tuple2(minimum, maximum);
									if (_v7.a.$ === 'Nothing') {
										if (_v7.b.$ === 'Nothing') {
											var _v8 = _v7.a;
											var _v9 = _v7.b;
											return $elm$core$String$fromInt(i) + 'fr';
										} else {
											var _v11 = _v7.a;
											var maxSize = _v7.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v7.b.$ === 'Nothing') {
											var minSize = _v7.a.a;
											var _v10 = _v7.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
										} else {
											var minSize = _v7.a.a;
											var maxSize = _v7.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 'Min':
									var m = x.a;
									var len = x.b;
									var $temp$minimum = $elm$core$Maybe$Just(m),
										$temp$maximum = maximum,
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
								default:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = minimum,
										$temp$maximum = $elm$core$Maybe$Just(m),
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
							}
						}
					});
				var toGridLength = function (x) {
					return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
				};
				var xSpacing = toGridLength(template.spacing.a);
				var ySpacing = toGridLength(template.spacing.b);
				var rows = function (x) {
					return 'grid-template-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.rows)));
				var msRows = function (x) {
					return '-ms-grid-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.columns)));
				var msColumns = function (x) {
					return '-ms-grid-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.columns)));
				var gapY = 'grid-row-gap:' + (toGridLength(template.spacing.b) + ';');
				var gapX = 'grid-column-gap:' + (toGridLength(template.spacing.a) + ';');
				var columns = function (x) {
					return 'grid-template-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.columns)));
				var _class = '.grid-rows-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.rows)) + ('-cols-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.columns)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.spacing.b)))))));
				var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msColumns + (msRows + '}')));
				return _List_fromArray(
					[base, supports]);
			case 'GridPosition':
				var position = rule.a;
				var msPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'-ms-grid-row: ' + ($elm$core$String$fromInt(position.row) + ';'),
							'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.height) + ';'),
							'-ms-grid-column: ' + ($elm$core$String$fromInt(position.col) + ';'),
							'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.width) + ';')
						]));
				var modernPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'grid-row: ' + ($elm$core$String$fromInt(position.row) + (' / ' + ($elm$core$String$fromInt(position.row + position.height) + ';'))),
							'grid-column: ' + ($elm$core$String$fromInt(position.col) + (' / ' + ($elm$core$String$fromInt(position.col + position.width) + ';')))
						]));
				var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.row) + ('-' + ($elm$core$String$fromInt(position.col) + ('-' + ($elm$core$String$fromInt(position.width) + ('-' + $elm$core$String$fromInt(position.height)))))));
				var modernGrid = _class + ('{' + (modernPosition + '}'));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msPosition + '}'));
				return _List_fromArray(
					[base, supports]);
			case 'PseudoSelector':
				var _class = rule.a;
				var styles = rule.b;
				var renderPseudoRule = function (style) {
					return A3(
						$mdgriffith$elm_ui$Internal$Model$renderStyleRule,
						options,
						style,
						$elm$core$Maybe$Just(_class));
				};
				return A2($elm$core$List$concatMap, renderPseudoRule, styles);
			default:
				var transform = rule.a;
				var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
				var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				var _v12 = _Utils_Tuple2(_class, val);
				if ((_v12.a.$ === 'Just') && (_v12.b.$ === 'Just')) {
					var cls = _v12.a.a;
					var v = _v12.b.a;
					return A4(
						$mdgriffith$elm_ui$Internal$Model$renderStyle,
						options,
						maybePseudo,
						'.' + cls,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
							]));
				} else {
					return _List_Nil;
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$encodeStyles = F2(
	function (options, stylesheet) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (style) {
					var styled = A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing);
					return _Utils_Tuple2(
						$mdgriffith$elm_ui$Internal$Model$getStyleName(style),
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styled));
				},
				stylesheet));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.text)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.fullSize, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.sizeByCapital + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.text)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {height: height / size, size: size, vertical: vertical};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.capital, adjustment.baseline, adjustment.descender, adjustment.lowercase]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.descender,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.baseline,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.capital,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		capital: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		full: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				$elm$core$String$fromFloat(converted.height)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.vertical) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.size) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 'Nothing') {
					if (face.$ === 'FontWith') {
						var _with = face.a;
						var _v2 = _with.adjustment;
						if (_v2.$ === 'Nothing') {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.full;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.capital;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 'ImportFont') {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 'Nothing') {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 'FontFamily') {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var combine = F2(
			function (style, rendered) {
				return {
					rules: _Utils_ap(
						rendered.rules,
						A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing)),
					topLevel: function () {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v1.$ === 'Nothing') {
							return rendered.topLevel;
						} else {
							var topLevel = _v1.a;
							return A2($elm$core$List$cons, topLevel, rendered.topLevel);
						}
					}()
				};
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			combine,
			{rules: _List_Nil, topLevel: _List_Nil},
			stylesheet);
		var topLevel = _v0.topLevel;
		var rules = _v0.rules;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			$elm$core$String$concat(rules));
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		var _v0 = options.mode;
		switch (_v0.$) {
			case 'Layout':
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'style',
					_List_Nil,
					_List_fromArray(
						[
							$elm$virtual_dom$VirtualDom$text(
							A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
						]));
			case 'NoStaticStyleSheet':
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'style',
					_List_Nil,
					_List_fromArray(
						[
							$elm$virtual_dom$VirtualDom$text(
							A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
						]));
			default:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'elm-ui-rules',
					_List_fromArray(
						[
							A2(
							$elm$virtual_dom$VirtualDom$property,
							'rules',
							A2($mdgriffith$elm_ui$Internal$Model$encodeStyles, options, styleSheet))
						]),
					_List_Nil);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.focus)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'static-stylesheet',
				$mdgriffith$elm_ui$Internal$Model$staticRoot(opts)),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.focus)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot(opts),
			A2($elm$core$List$cons, dynamicStyleSheet, children)) : A2($elm$core$List$cons, dynamicStyleSheet, children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$core$Bitwise$and = _Bitwise_and;
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (myFlag.$ === 'Flag') {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 'Keyed') {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 'NoStyleSheet':
									return keyed;
								case 'OnlyDynamic':
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 'NoStyleSheet':
									return unkeyed;
								case 'OnlyDynamic':
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 'Generic':
					return A2(createNode, 'div', attributes);
				case 'NodeName':
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.single))
									]))
							]));
			}
		}();
		switch (parentContext.$) {
			case 'AsRow':
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.contentCenterY, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerRight])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.contentCenterY, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterX])))
						]),
					_List_fromArray(
						[html])) : html));
			case 'AsColumn':
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerCenterY])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.container, $mdgriffith$elm_ui$Internal$Style$classes.alignContainerBottom])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $mdgriffith$elm_ui$Internal$Model$textElementClasses = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.widthContent + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.heightContent)))));
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFillClasses = $mdgriffith$elm_ui$Internal$Style$classes.any + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.text + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.widthFill + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.heightFill)))));
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementFillClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 'Unstyled':
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 'Styled':
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles));
					case 'Text':
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 'Unstyled':
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 'Styled':
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.styles : _Utils_ap(styled.styles, existingStyles));
					case 'Text':
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 'Keyed') {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.styles : _Utils_ap(rendered.styles, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.has,
						rendered.node,
						rendered.attributes,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.children)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						html: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.has,
							rendered.node,
							rendered.attributes,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.children))),
						styles: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.styles : _Utils_ap(rendered.styles, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.has,
						rendered.node,
						rendered.attributes,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.children)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						html: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.has,
							rendered.node,
							rendered.attributes,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.children))),
						styles: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 'Single', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 'Transform', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (myFlag.$ === 'Flag') {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 'ChildrenBehind', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 'ChildrenBehindAndInFront', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 'ChildrenInFront', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location.$) {
							case 'Above':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.above]));
							case 'Below':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.below]));
							case 'OnRight':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.onRight]));
							case 'OnLeft':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.onLeft]));
							case 'InFront':
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.inFront]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.nearby, $mdgriffith$elm_ui$Internal$Style$classes.single, $mdgriffith$elm_ui$Internal$Style$classes.behind]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 'Empty':
							return $elm$virtual_dom$VirtualDom$text('');
						case 'Text':
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 'Unstyled':
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.html, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 'NoNearbyChildren':
				if (location.$ === 'Behind') {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 'ChildrenBehind':
				var existingBehind = existing.a;
				if (location.$ === 'Behind') {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 'ChildrenInFront':
				var existingInFront = existing.a;
				if (location.$ === 'Behind') {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location.$ === 'Behind') {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 'Embedded', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 'NodeName', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 'Generic':
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 'NodeName':
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align.$) {
		case 'Left':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedHorizontally + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignLeft);
		case 'Right':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedHorizontally + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignRight);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedHorizontally + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignCenterX);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align.$) {
		case 'Top':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedVertically + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignTop);
		case 'Bottom':
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedVertically + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignBottom);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.alignedVertically + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.alignCenterY);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 'FullTransform', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 'Moved', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 'Untransformed':
				switch (component.$) {
					case 'MoveX':
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 'MoveY':
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 'MoveZ':
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 'MoveXYZ':
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 'Rotate':
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 'Moved':
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 'MoveX':
						var newX = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 'MoveY':
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 'MoveZ':
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 'MoveXYZ':
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 'Rotate':
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 'MoveX':
						var newX = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 'MoveY':
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 'MoveZ':
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 'MoveXYZ':
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 'Rotate':
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 'Px':
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.heightExact + (' ' + name),
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 'Content':
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.heightContent,
				_List_Nil);
		case 'Fill':
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.heightFill,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.heightFillPortion + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.column + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 'Min':
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 'Px':
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.widthExact + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 'Content':
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.widthContent,
				_List_Nil);
		case 'Fill':
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.widthFill,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.widthFillPortion + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.row + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 'Min':
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $elm$core$Basics$ge = _Utils_ge;
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 'Single') {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 'FontSize':
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 'PaddingStyle':
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 'Nothing') {
					return {
						attributes: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						children: children,
						has: has,
						node: node,
						styles: styles
					};
				} else {
					var _class = _v1.a;
					return {
						attributes: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						children: children,
						has: has,
						node: node,
						styles: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 'NoAttribute':
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'Class':
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 'Attr':
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'StyleClass':
						var flag = attribute.a;
						var style = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 'TransformComponent':
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'Width':
						var width = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 'Px':
									var px = width.a;
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.widthExact + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Content':
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.widthContent),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Fill':
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.widthFill),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.widthFillPortion + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.row + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 'Height':
						var height = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 'Px':
									var px = height.a;
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.heightExact + (' ' + (name + (' ' + classes))),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Content':
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.heightContent + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 'Fill':
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.heightFill + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.heightFillPortion + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.any + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.column + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 'Describe':
						var description = attribute.a;
						switch (description.$) {
							case 'Main':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Navigation':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'ContentInfo':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Complementary':
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Heading':
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 'Paragraph':
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Button':
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'Label':
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 'LivePolite':
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 'Nearby':
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 'Empty':
									return styles;
								case 'Text':
									var str = elem.a;
									return styles;
								case 'Unstyled':
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.styles);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 'AlignX':
						var x = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x.$) {
									case 'CenterX':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 'Right':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y.$) {
									case 'CenterY':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 'Bottom':
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 'Untransformed'};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 'Height', a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 'Attr', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 'Content'};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 'Width', a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentTop + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.contentLeft)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 'Fill', a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $mdgriffith$elm_ui$Element$Input$HiddenLabel = function (a) {
	return {$: 'HiddenLabel', a: a};
};
var $mdgriffith$elm_ui$Element$Input$labelHidden = $mdgriffith$elm_ui$Element$Input$HiddenLabel;
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$problemToString = function (problem) {
	switch (problem.$) {
		case 'Expecting':
			var string = problem.a;
			return 'Expecting ' + string;
		case 'ExpectingInt':
			return 'Expecting int';
		case 'ExpectingHex':
			return 'Expecting hex';
		case 'ExpectingOctal':
			return 'Expecting octal';
		case 'ExpectingBinary':
			return 'Expecting binary';
		case 'ExpectingFloat':
			return 'Expecting float';
		case 'ExpectingNumber':
			return 'Expecting number';
		case 'ExpectingVariable':
			return 'Expecting variable';
		case 'ExpectingSymbol':
			var string = problem.a;
			return 'Expecting symbol ' + string;
		case 'ExpectingKeyword':
			var string = problem.a;
			return 'Expecting keyword ' + string;
		case 'ExpectingEnd':
			return 'Expecting keyword end';
		case 'UnexpectedChar':
			return 'Unexpected char';
		case 'Problem':
			var problemDescription = problem.a;
			return problemDescription;
		default:
			return 'Bad repeat';
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString = function (deadEnd) {
	return 'Problem at row ' + ($elm$core$String$fromInt(deadEnd.row) + ('\n' + $dillonkearns$elm_markdown$Markdown$Parser$problemToString(deadEnd.problem)));
};
var $dillonkearns$elm_markdown$Markdown$Block$Body = function (a) {
	return {$: 'Body', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$Body = function (a) {
	return {$: 'Body', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$CodeBlock = function (a) {
	return {$: 'CodeBlock', a: a};
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 'Expecting', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Html = F3(
	function (a, b, c) {
		return {$: 'Html', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Parser$Html = F3(
	function (a, b, c) {
		return {$: 'Html', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Parser$UnparsedInlines = function (a) {
	return {$: 'UnparsedInlines', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$BlankLine = {$: 'BlankLine'};
var $dillonkearns$elm_markdown$Markdown$Parser$blankLine = A2(
	$elm$parser$Parser$Advanced$map,
	function (_v0) {
		return $dillonkearns$elm_markdown$Markdown$Parser$BlankLine;
	},
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$token(
			A2(
				$elm$parser$Parser$Advanced$Token,
				'\n',
				$elm$parser$Parser$Expecting('\n'))),
		$elm$parser$Parser$Advanced$chompWhile(
			function (c) {
				return _Utils_eq(
					c,
					_Utils_chr('\n'));
			})));
var $dillonkearns$elm_markdown$Markdown$Parser$combine = function (list) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (parser, listParser) {
				return A2(
					$elm$parser$Parser$Advanced$andThen,
					function (soFar) {
						return A2(
							$elm$parser$Parser$Advanced$map,
							function (a) {
								return A2($elm$core$List$cons, a, soFar);
							},
							parser);
					},
					listParser);
			}),
		$elm$parser$Parser$Advanced$succeed(_List_Nil),
		list);
};
var $dillonkearns$elm_markdown$XmlParser$Element = F3(
	function (a, b, c) {
		return {$: 'Element', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$XmlParser$Text = function (a) {
	return {$: 'Text', a: a};
};
var $dillonkearns$elm_markdown$XmlParser$Attribute = F2(
	function (name, value) {
		return {name: name, value: value};
	});
var $elm$parser$Parser$Advanced$Located = F3(
	function (row, col, context) {
		return {col: col, context: context, row: row};
	});
var $elm$parser$Parser$Advanced$changeContext = F2(
	function (newContext, s) {
		return {col: s.col, context: newContext, indent: s.indent, offset: s.offset, row: s.row, src: s.src};
	});
var $elm$parser$Parser$Advanced$inContext = F2(
	function (context, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(
					A2(
						$elm$parser$Parser$Advanced$changeContext,
						A2(
							$elm$core$List$cons,
							A3($elm$parser$Parser$Advanced$Located, s0.row, s0.col, context),
							s0.context),
						s0));
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						a,
						A2($elm$parser$Parser$Advanced$changeContext, s0.context, s1));
				} else {
					var step = _v1;
					return step;
				}
			});
	});
var $dillonkearns$elm_markdown$XmlParser$isWhitespace = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || (_Utils_eq(
		c,
		_Utils_chr('\u000D')) || (_Utils_eq(
		c,
		_Utils_chr('\n')) || _Utils_eq(
		c,
		_Utils_chr('\t'))));
};
var $elm$parser$Parser$BadRepeat = {$: 'BadRepeat'};
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $dillonkearns$elm_markdown$XmlParser$keep = F2(
	function (count, predicate) {
		var n = count.a;
		return A2(
			$elm$parser$Parser$Advanced$andThen,
			function (str) {
				return (_Utils_cmp(
					n,
					$elm$core$String$length(str)) < 1) ? $elm$parser$Parser$Advanced$succeed(str) : $elm$parser$Parser$Advanced$problem($elm$parser$Parser$BadRepeat);
			},
			$elm$parser$Parser$Advanced$getChompedString(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
					$elm$parser$Parser$Advanced$chompWhile(predicate))));
	});
var $dillonkearns$elm_markdown$XmlParser$AtLeast = function (a) {
	return {$: 'AtLeast', a: a};
};
var $dillonkearns$elm_markdown$XmlParser$oneOrMore = $dillonkearns$elm_markdown$XmlParser$AtLeast(1);
var $dillonkearns$elm_markdown$XmlParser$attributeName = A2(
	$elm$parser$Parser$Advanced$inContext,
	'attributeName',
	A2(
		$dillonkearns$elm_markdown$XmlParser$keep,
		$dillonkearns$elm_markdown$XmlParser$oneOrMore,
		function (c) {
			return (!$dillonkearns$elm_markdown$XmlParser$isWhitespace(c)) && ((!_Utils_eq(
				c,
				_Utils_chr('/'))) && ((!_Utils_eq(
				c,
				_Utils_chr('<'))) && ((!_Utils_eq(
				c,
				_Utils_chr('>'))) && ((!_Utils_eq(
				c,
				_Utils_chr('\"'))) && ((!_Utils_eq(
				c,
				_Utils_chr('\''))) && (!_Utils_eq(
				c,
				_Utils_chr('='))))))));
		}));
var $dillonkearns$elm_markdown$XmlParser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $elm$core$String$cons = _String_cons;
var $dillonkearns$elm_markdown$XmlParser$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'amp',
			_Utils_chr('&')),
			_Utils_Tuple2(
			'lt',
			_Utils_chr('<')),
			_Utils_Tuple2(
			'gt',
			_Utils_chr('>')),
			_Utils_Tuple2(
			'apos',
			_Utils_chr('\'')),
			_Utils_Tuple2(
			'quot',
			_Utils_chr('\"'))
		]));
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (maybe.$ === 'Just') {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $dillonkearns$elm_markdown$XmlParser$decodeEscape = function (s) {
	return A2($elm$core$String$startsWith, '#x', s) ? A2(
		$elm$core$Result$mapError,
		$elm$parser$Parser$Problem,
		A2(
			$elm$core$Result$map,
			$elm$core$Char$fromCode,
			$rtfeldman$elm_hex$Hex$fromString(
				A2($elm$core$String$dropLeft, 2, s)))) : (A2($elm$core$String$startsWith, '#', s) ? A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('Invalid escaped charactor: ' + s),
		A2(
			$elm$core$Maybe$map,
			$elm$core$Char$fromCode,
			$elm$core$String$toInt(
				A2($elm$core$String$dropLeft, 1, s)))) : A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('No entity named \"&' + (s + ';\" found.')),
		A2($elm$core$Dict$get, s, $dillonkearns$elm_markdown$XmlParser$entities)));
};
var $dillonkearns$elm_markdown$XmlParser$fail = function (str) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(str));
};
var $dillonkearns$elm_markdown$XmlParser$escapedChar = function (end_) {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'escapedChar',
		A2(
			$elm$parser$Parser$Advanced$andThen,
			function (s) {
				return $elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$Advanced$andThen,
							function (_v0) {
								var _v1 = $dillonkearns$elm_markdown$XmlParser$decodeEscape(s);
								if (_v1.$ === 'Ok') {
									var c = _v1.a;
									return $elm$parser$Parser$Advanced$succeed(c);
								} else {
									var e = _v1.a;
									return $elm$parser$Parser$Advanced$problem(e);
								}
							},
							$dillonkearns$elm_markdown$XmlParser$symbol(';')),
							$dillonkearns$elm_markdown$XmlParser$fail('Entities must end_ with \";\": &' + s)
						]));
			},
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
					$dillonkearns$elm_markdown$XmlParser$symbol('&')),
				A2(
					$dillonkearns$elm_markdown$XmlParser$keep,
					$dillonkearns$elm_markdown$XmlParser$oneOrMore,
					function (c) {
						return (!_Utils_eq(c, end_)) && (!_Utils_eq(
							c,
							_Utils_chr(';')));
					}))));
};
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = thunk(_Utils_Tuple0);
			var parse = _v0.a;
			return parse(s);
		});
};
var $dillonkearns$elm_markdown$XmlParser$zeroOrMore = $dillonkearns$elm_markdown$XmlParser$AtLeast(0);
var $dillonkearns$elm_markdown$XmlParser$textString = function (end_) {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'textString',
		A2(
			$elm$parser$Parser$Advanced$andThen,
			function (s) {
				return $elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$Advanced$keeper,
							A2(
								$elm$parser$Parser$Advanced$keeper,
								$elm$parser$Parser$Advanced$succeed(
									F2(
										function (c, t) {
											return _Utils_ap(
												s,
												A2($elm$core$String$cons, c, t));
										})),
								$dillonkearns$elm_markdown$XmlParser$escapedChar(end_)),
							$elm$parser$Parser$Advanced$lazy(
								function (_v0) {
									return $dillonkearns$elm_markdown$XmlParser$textString(end_);
								})),
							$elm$parser$Parser$Advanced$succeed(s)
						]));
			},
			A2(
				$dillonkearns$elm_markdown$XmlParser$keep,
				$dillonkearns$elm_markdown$XmlParser$zeroOrMore,
				function (c) {
					return (!_Utils_eq(c, end_)) && (!_Utils_eq(
						c,
						_Utils_chr('&')));
				})));
};
var $dillonkearns$elm_markdown$XmlParser$attributeValue = A2(
	$elm$parser$Parser$Advanced$inContext,
	'attributeValue',
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
					$dillonkearns$elm_markdown$XmlParser$symbol('\"')),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$XmlParser$textString(
						_Utils_chr('\"')),
					$dillonkearns$elm_markdown$XmlParser$symbol('\"'))),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
					$dillonkearns$elm_markdown$XmlParser$symbol('\'')),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$XmlParser$textString(
						_Utils_chr('\'')),
					$dillonkearns$elm_markdown$XmlParser$symbol('\'')))
			])));
var $dillonkearns$elm_markdown$XmlParser$ignore = F2(
	function (count, predicate) {
		return A2(
			$elm$parser$Parser$Advanced$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			A2($dillonkearns$elm_markdown$XmlParser$keep, count, predicate));
	});
var $dillonkearns$elm_markdown$XmlParser$whiteSpace = A2($dillonkearns$elm_markdown$XmlParser$ignore, $dillonkearns$elm_markdown$XmlParser$zeroOrMore, $dillonkearns$elm_markdown$XmlParser$isWhitespace);
var $dillonkearns$elm_markdown$XmlParser$attribute = A2(
	$elm$parser$Parser$Advanced$inContext,
	'attribute',
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$XmlParser$Attribute),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$XmlParser$attributeName, $dillonkearns$elm_markdown$XmlParser$whiteSpace),
					$dillonkearns$elm_markdown$XmlParser$symbol('=')),
				$dillonkearns$elm_markdown$XmlParser$whiteSpace)),
		$dillonkearns$elm_markdown$XmlParser$attributeValue));
var $dillonkearns$elm_markdown$XmlParser$attributes = function (keys) {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'attributes',
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$andThen,
					function (attr) {
						return A2($elm$core$Set$member, attr.name, keys) ? $dillonkearns$elm_markdown$XmlParser$fail('attribute ' + (attr.name + ' is duplicated')) : A2(
							$elm$parser$Parser$Advanced$keeper,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								$elm$parser$Parser$Advanced$succeed(
									$elm$core$List$cons(attr)),
								$dillonkearns$elm_markdown$XmlParser$whiteSpace),
							$dillonkearns$elm_markdown$XmlParser$attributes(
								A2($elm$core$Set$insert, attr.name, keys)));
					},
					$dillonkearns$elm_markdown$XmlParser$attribute),
					$elm$parser$Parser$Advanced$succeed(_List_Nil)
				])));
};
var $dillonkearns$elm_markdown$XmlParser$tagName = A2(
	$elm$parser$Parser$Advanced$inContext,
	'tagName',
	A2(
		$dillonkearns$elm_markdown$XmlParser$keep,
		$dillonkearns$elm_markdown$XmlParser$oneOrMore,
		function (c) {
			return (!$dillonkearns$elm_markdown$XmlParser$isWhitespace(c)) && ((!_Utils_eq(
				c,
				_Utils_chr('/'))) && ((!_Utils_eq(
				c,
				_Utils_chr('<'))) && ((!_Utils_eq(
				c,
				_Utils_chr('>'))) && ((!_Utils_eq(
				c,
				_Utils_chr('\"'))) && ((!_Utils_eq(
				c,
				_Utils_chr('\''))) && (!_Utils_eq(
				c,
				_Utils_chr('='))))))));
		}));
var $dillonkearns$elm_markdown$XmlParser$closingTag = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'closingTag',
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
							$dillonkearns$elm_markdown$XmlParser$symbol('</')),
						$dillonkearns$elm_markdown$XmlParser$whiteSpace),
					A2(
						$elm$parser$Parser$Advanced$andThen,
						function (endTagName) {
							return _Utils_eq(startTagName, endTagName) ? $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0) : $dillonkearns$elm_markdown$XmlParser$fail('tag name mismatch: ' + (startTagName + (' and ' + endTagName)));
						},
						$dillonkearns$elm_markdown$XmlParser$tagName)),
				$dillonkearns$elm_markdown$XmlParser$whiteSpace),
			$dillonkearns$elm_markdown$XmlParser$symbol('>')));
};
function $dillonkearns$elm_markdown$XmlParser$cyclic$cdataContent() {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'cdataContent',
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(''),
					$dillonkearns$elm_markdown$XmlParser$symbol(']]>')),
					A2(
					$elm$parser$Parser$Advanced$andThen,
					function (_v0) {
						return A2(
							$elm$parser$Parser$Advanced$map,
							function (tail) {
								return ']]' + tail;
							},
							$dillonkearns$elm_markdown$XmlParser$cyclic$cdataContent());
					},
					$dillonkearns$elm_markdown$XmlParser$symbol(']]')),
					A2(
					$elm$parser$Parser$Advanced$andThen,
					function (_v1) {
						return A2(
							$elm$parser$Parser$Advanced$map,
							function (tail) {
								return ']' + tail;
							},
							$dillonkearns$elm_markdown$XmlParser$cyclic$cdataContent());
					},
					$dillonkearns$elm_markdown$XmlParser$symbol(']')),
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$append),
						A2(
							$dillonkearns$elm_markdown$XmlParser$keep,
							$dillonkearns$elm_markdown$XmlParser$zeroOrMore,
							function (c) {
								return !_Utils_eq(
									c,
									_Utils_chr(']'));
							})),
					$elm$parser$Parser$Advanced$lazy(
						function (_v2) {
							return $dillonkearns$elm_markdown$XmlParser$cyclic$cdataContent();
						}))
				])));
}
try {
	var $dillonkearns$elm_markdown$XmlParser$cdataContent = $dillonkearns$elm_markdown$XmlParser$cyclic$cdataContent();
	$dillonkearns$elm_markdown$XmlParser$cyclic$cdataContent = function () {
		return $dillonkearns$elm_markdown$XmlParser$cdataContent;
	};
} catch ($) {
	throw 'Some top-level definitions from `XmlParser` are causing infinite recursion:\n\n  ┌─────┐\n  │    cdataContent\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $dillonkearns$elm_markdown$XmlParser$cdata = A2(
	$elm$parser$Parser$Advanced$inContext,
	'cdata',
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$dillonkearns$elm_markdown$XmlParser$symbol('<![CDATA[')),
		$dillonkearns$elm_markdown$XmlParser$cdataContent));
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.context)) : A3(
				$elm$parser$Parser$Advanced$Good,
				_Utils_cmp(s.offset, newOffset) < 0,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $dillonkearns$elm_markdown$XmlParser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $dillonkearns$elm_markdown$XmlParser$comment = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
			$elm$parser$Parser$Advanced$token(
				$dillonkearns$elm_markdown$XmlParser$toToken('<!--'))),
		$elm$parser$Parser$Advanced$chompUntil(
			$dillonkearns$elm_markdown$XmlParser$toToken('-->'))),
	$elm$parser$Parser$Advanced$token(
		$dillonkearns$elm_markdown$XmlParser$toToken('-->')));
function $dillonkearns$elm_markdown$XmlParser$cyclic$textNodeString() {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'textNodeString',
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(
							F2(
								function (s, maybeString) {
									return $elm$core$Maybe$Just(
										_Utils_ap(
											s,
											A2($elm$core$Maybe$withDefault, '', maybeString)));
								})),
						A2(
							$dillonkearns$elm_markdown$XmlParser$keep,
							$dillonkearns$elm_markdown$XmlParser$oneOrMore,
							function (c) {
								return (!_Utils_eq(
									c,
									_Utils_chr('<'))) && (!_Utils_eq(
									c,
									_Utils_chr('&')));
							})),
					$elm$parser$Parser$Advanced$lazy(
						function (_v0) {
							return $dillonkearns$elm_markdown$XmlParser$cyclic$textNodeString();
						})),
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(
							F2(
								function (c, maybeString) {
									return $elm$core$Maybe$Just(
										A2(
											$elm$core$String$cons,
											c,
											A2($elm$core$Maybe$withDefault, '', maybeString)));
								})),
						$dillonkearns$elm_markdown$XmlParser$escapedChar(
							_Utils_chr('<'))),
					$elm$parser$Parser$Advanced$lazy(
						function (_v1) {
							return $dillonkearns$elm_markdown$XmlParser$cyclic$textNodeString();
						})),
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(
							F2(
								function (s, maybeString) {
									var str = _Utils_ap(
										s,
										A2($elm$core$Maybe$withDefault, '', maybeString));
									return (str !== '') ? $elm$core$Maybe$Just(str) : $elm$core$Maybe$Nothing;
								})),
						$dillonkearns$elm_markdown$XmlParser$cdata),
					$elm$parser$Parser$Advanced$lazy(
						function (_v2) {
							return $dillonkearns$elm_markdown$XmlParser$cyclic$textNodeString();
						})),
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(
							function (maybeString) {
								var str = A2($elm$core$Maybe$withDefault, '', maybeString);
								return (str !== '') ? $elm$core$Maybe$Just(str) : $elm$core$Maybe$Nothing;
							}),
						$dillonkearns$elm_markdown$XmlParser$comment),
					$elm$parser$Parser$Advanced$lazy(
						function (_v3) {
							return $dillonkearns$elm_markdown$XmlParser$cyclic$textNodeString();
						})),
					$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing)
				])));
}
try {
	var $dillonkearns$elm_markdown$XmlParser$textNodeString = $dillonkearns$elm_markdown$XmlParser$cyclic$textNodeString();
	$dillonkearns$elm_markdown$XmlParser$cyclic$textNodeString = function () {
		return $dillonkearns$elm_markdown$XmlParser$textNodeString;
	};
} catch ($) {
	throw 'Some top-level definitions from `XmlParser` are causing infinite recursion:\n\n  ┌─────┐\n  │    textNodeString\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $dillonkearns$elm_markdown$XmlParser$children = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'children',
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(_List_Nil),
					$dillonkearns$elm_markdown$XmlParser$closingTag(startTagName)),
					A2(
					$elm$parser$Parser$Advanced$andThen,
					function (maybeString) {
						if (maybeString.$ === 'Just') {
							var s = maybeString.a;
							return A2(
								$elm$parser$Parser$Advanced$keeper,
								$elm$parser$Parser$Advanced$succeed(
									function (rest) {
										return A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$XmlParser$Text(s),
											rest);
									}),
								$dillonkearns$elm_markdown$XmlParser$children(startTagName));
						} else {
							return A2(
								$elm$parser$Parser$Advanced$ignorer,
								$elm$parser$Parser$Advanced$succeed(_List_Nil),
								$dillonkearns$elm_markdown$XmlParser$closingTag(startTagName));
						}
					},
					$dillonkearns$elm_markdown$XmlParser$textNodeString),
					$elm$parser$Parser$Advanced$lazy(
					function (_v2) {
						return A2(
							$elm$parser$Parser$Advanced$keeper,
							A2(
								$elm$parser$Parser$Advanced$keeper,
								$elm$parser$Parser$Advanced$succeed($elm$core$List$cons),
								$dillonkearns$elm_markdown$XmlParser$cyclic$element()),
							$dillonkearns$elm_markdown$XmlParser$children(startTagName));
					})
				])));
};
function $dillonkearns$elm_markdown$XmlParser$cyclic$element() {
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'element',
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$dillonkearns$elm_markdown$XmlParser$symbol('<')),
			A2(
				$elm$parser$Parser$Advanced$andThen,
				function (startTagName) {
					return A2(
						$elm$parser$Parser$Advanced$keeper,
						A2(
							$elm$parser$Parser$Advanced$keeper,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								$elm$parser$Parser$Advanced$succeed(
									$dillonkearns$elm_markdown$XmlParser$Element(startTagName)),
								$dillonkearns$elm_markdown$XmlParser$whiteSpace),
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								$dillonkearns$elm_markdown$XmlParser$attributes($elm$core$Set$empty),
								$dillonkearns$elm_markdown$XmlParser$whiteSpace)),
						$elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$Advanced$ignorer,
									$elm$parser$Parser$Advanced$succeed(_List_Nil),
									$dillonkearns$elm_markdown$XmlParser$symbol('/>')),
									A2(
									$elm$parser$Parser$Advanced$keeper,
									A2(
										$elm$parser$Parser$Advanced$ignorer,
										$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
										$dillonkearns$elm_markdown$XmlParser$symbol('>')),
									$elm$parser$Parser$Advanced$lazy(
										function (_v0) {
											return $dillonkearns$elm_markdown$XmlParser$children(startTagName);
										}))
								])));
				},
				$dillonkearns$elm_markdown$XmlParser$tagName)));
}
try {
	var $dillonkearns$elm_markdown$XmlParser$element = $dillonkearns$elm_markdown$XmlParser$cyclic$element();
	$dillonkearns$elm_markdown$XmlParser$cyclic$element = function () {
		return $dillonkearns$elm_markdown$XmlParser$element;
	};
} catch ($) {
	throw 'Some top-level definitions from `XmlParser` are causing infinite recursion:\n\n  ┌─────┐\n  │    children\n  │     ↓\n  │    element\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $elm$parser$Parser$Advanced$end = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return _Utils_eq(
				$elm$core$String$length(s.src),
				s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $dillonkearns$elm_markdown$Markdown$Parser$Heading = F2(
	function (a, b) {
		return {$: 'Heading', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = A5(_Parser_findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v0.a;
			var newRow = _v0.b;
			var newCol = _v0.c;
			var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.src) : newOffset;
			return A3(
				$elm$parser$Parser$Advanced$Good,
				_Utils_cmp(s.offset, adjustedOffset) < 0,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: adjustedOffset, row: newRow, src: s.src});
		});
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $elm$core$String$trimRight = _String_trimRight;
var $dillonkearns$elm_markdown$Markdown$Parser$dropTrailingHashes = function (headingString) {
	return A2($elm$core$String$endsWith, '#', headingString) ? $dillonkearns$elm_markdown$Markdown$Parser$dropTrailingHashes(
		$elm$core$String$trimRight(
			A2($elm$core$String$dropRight, 1, headingString))) : headingString;
};
var $dillonkearns$elm_markdown$Markdown$Parser$heading = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$Parser$Heading),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'#',
					$elm$parser$Parser$Expecting('#')))),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$andThen,
				function (additionalHashes) {
					var level = $elm$core$String$length(additionalHashes) + 1;
					return (level >= 7) ? $elm$parser$Parser$Advanced$problem(
						$elm$parser$Parser$Expecting('heading with < 7 #\'s')) : $elm$parser$Parser$Advanced$succeed(level);
				},
				$elm$parser$Parser$Advanced$getChompedString(
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
						$elm$parser$Parser$Advanced$chompWhile(
							function (c) {
								return _Utils_eq(
									c,
									_Utils_chr('#'));
							})))),
			$elm$parser$Parser$Advanced$chompWhile(
				function (c) {
					return _Utils_eq(
						c,
						_Utils_chr(' '));
				}))),
	A2(
		$elm$parser$Parser$Advanced$andThen,
		function (headingText) {
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$Parser$UnparsedInlines(
					$dillonkearns$elm_markdown$Markdown$Parser$dropTrailingHashes(headingText)));
		},
		$elm$parser$Parser$Advanced$getChompedString(
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
				$elm$parser$Parser$Advanced$chompUntilEndOr('\n')))));
var $dillonkearns$elm_markdown$Markdown$Parser$ListBlock = function (a) {
	return {$: 'ListBlock', a: a};
};
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0.a;
	return $elm$parser$Parser$Advanced$Parser(
		function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, false, x);
			} else {
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
			}
		});
};
var $dillonkearns$elm_markdown$Markdown$List$listMarkerParser = function () {
	var markerOption = function (marker) {
		return $elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					marker,
					$elm$parser$Parser$ExpectingSymbol(marker))));
	};
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				markerOption('-'),
				markerOption('+'),
				markerOption('*')
			]));
}();
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
				return _Utils_eq(newOffset, -1) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src}) : A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src}));
			});
	});
var $dillonkearns$elm_markdown$Parser$Extra$oneOrMore = function (condition) {
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$chompIf,
			condition,
			$elm$parser$Parser$Problem('Expected one or more character')),
		$elm$parser$Parser$Advanced$chompWhile(condition));
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $dillonkearns$elm_markdown$Markdown$List$openingItemParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		$elm$parser$Parser$Advanced$succeed($elm$core$Tuple$pair),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$List$listMarkerParser),
			$dillonkearns$elm_markdown$Parser$Extra$oneOrMore(
				function (c) {
					return _Utils_eq(
						c,
						_Utils_chr(' '));
				}))),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('\n')),
		$elm$parser$Parser$Advanced$symbol(
			A2(
				$elm$parser$Parser$Advanced$Token,
				'\n',
				$elm$parser$Parser$ExpectingSymbol('\n')))));
var $elm$parser$Parser$Advanced$getOffset = $elm$parser$Parser$Advanced$Parser(
	function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, s.offset, s);
	});
var $dillonkearns$elm_markdown$Markdown$List$singleItemParser = function (listMarker) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							listMarker,
							$elm$parser$Parser$ExpectingSymbol(listMarker))),
					$dillonkearns$elm_markdown$Parser$Extra$oneOrMore(
						function (c) {
							return _Utils_eq(
								c,
								_Utils_chr(' '));
						})))),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompUntilEndOr('\n')),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'\n',
					$elm$parser$Parser$ExpectingSymbol('\n')))));
};
var $dillonkearns$elm_markdown$Markdown$List$statementsHelp = F3(
	function (listMarker, firstItem, revStmts) {
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						A2(
							$elm$parser$Parser$Advanced$keeper,
							$elm$parser$Parser$Advanced$succeed(
								F3(
									function (offsetBefore, stmt, offsetAfter) {
										return $elm$parser$Parser$Advanced$Loop(
											A2($elm$core$List$cons, stmt, revStmts));
									})),
							$elm$parser$Parser$Advanced$getOffset),
						$dillonkearns$elm_markdown$Markdown$List$singleItemParser(listMarker)),
					$elm$parser$Parser$Advanced$getOffset),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(
							A2(
								$elm$core$List$cons,
								firstItem,
								$elm$core$List$reverse(revStmts)));
					},
					$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0))
				]));
	});
var $dillonkearns$elm_markdown$Markdown$List$parser = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (_v0) {
		var listMarker = _v0.a;
		var firstItem = _v0.b;
		return A2(
			$elm$parser$Parser$Advanced$loop,
			_List_Nil,
			A2($dillonkearns$elm_markdown$Markdown$List$statementsHelp, listMarker, firstItem));
	},
	$dillonkearns$elm_markdown$Markdown$List$openingItemParser);
var $dillonkearns$elm_markdown$Markdown$Parser$listBlock = A2(
	$elm$parser$Parser$Advanced$map,
	$dillonkearns$elm_markdown$Markdown$Parser$ListBlock,
	A2(
		$elm$parser$Parser$Advanced$map,
		$elm$core$List$map($dillonkearns$elm_markdown$Markdown$Parser$UnparsedInlines),
		$dillonkearns$elm_markdown$Markdown$List$parser));
var $dillonkearns$elm_markdown$Markdown$Block$CodeBlock = function (a) {
	return {$: 'CodeBlock', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Heading = F2(
	function (a, b) {
		return {$: 'Heading', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Block$ListBlock = function (a) {
	return {$: 'ListBlock', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$ThematicBreak = {$: 'ThematicBreak'};
var $dillonkearns$elm_markdown$Markdown$Parser$just = function (value) {
	return $elm$parser$Parser$Advanced$succeed(
		$elm$core$Maybe$Just(value));
};
var $dillonkearns$elm_markdown$Markdown$Inlines$isUninteresting = function (_char) {
	return (!_Utils_eq(
		_char,
		_Utils_chr('*'))) && ((!_Utils_eq(
		_char,
		_Utils_chr('`'))) && ((!_Utils_eq(
		_char,
		_Utils_chr('['))) && (!_Utils_eq(
		_char,
		_Utils_chr('!')))));
};
var $dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenAllFailed = F2(
	function (_v0, string) {
		var currStyle = _v0.a;
		var revStyledStrings = _v0.b;
		return $elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple3(
				currStyle,
				revStyledStrings,
				$elm$core$Maybe$Just(string)));
	});
var $dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundBold = F2(
	function (_v0, string) {
		var currStyle = _v0.a;
		var revStyledStrings = _v0.b;
		return $elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple3(
				_Utils_update(
					currStyle,
					{isBold: !currStyle.isBold}),
				A2(
					$elm$core$List$cons,
					{string: string, style: currStyle},
					revStyledStrings),
				$elm$core$Maybe$Nothing));
	});
var $dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundCode = F2(
	function (_v0, string) {
		var currStyle = _v0.a;
		var revStyledStrings = _v0.b;
		return $elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple3(
				_Utils_update(
					currStyle,
					{isCode: !currStyle.isCode}),
				A2(
					$elm$core$List$cons,
					{string: string, style: currStyle},
					revStyledStrings),
				$elm$core$Maybe$Nothing));
	});
var $dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundItalic = F2(
	function (_v0, string) {
		var currStyle = _v0.a;
		var revStyledStrings = _v0.b;
		return $elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple3(
				_Utils_update(
					currStyle,
					{isItalic: !currStyle.isItalic}),
				A2(
					$elm$core$List$cons,
					{string: string, style: currStyle},
					revStyledStrings),
				$elm$core$Maybe$Nothing));
	});
var $dillonkearns$elm_markdown$Markdown$Block$Image = function (a) {
	return {$: 'Image', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Link = function (a) {
	return {$: 'Link', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundLink = F3(
	function (link, _v0, string) {
		var currStyle = _v0.a;
		var revStyledStrings = _v0.b;
		if (link.$ === 'Link') {
			var record = link.a;
			return $elm$parser$Parser$Advanced$Loop(
				_Utils_Tuple3(
					currStyle,
					A2(
						$elm$core$List$cons,
						{
							string: record.description,
							style: _Utils_update(
								currStyle,
								{
									link: $elm$core$Maybe$Just(
										{
											destination: $dillonkearns$elm_markdown$Markdown$Block$Link(record.destination),
											title: record.title
										})
								})
						},
						A2(
							$elm$core$List$cons,
							{string: string, style: currStyle},
							revStyledStrings)),
					$elm$core$Maybe$Nothing));
		} else {
			var record = link.a;
			return $elm$parser$Parser$Advanced$Loop(
				_Utils_Tuple3(
					currStyle,
					A2(
						$elm$core$List$cons,
						{
							string: record.alt,
							style: _Utils_update(
								currStyle,
								{
									link: $elm$core$Maybe$Just(
										{
											destination: $dillonkearns$elm_markdown$Markdown$Block$Image(record.src),
											title: $elm$core$Maybe$Nothing
										})
								})
						},
						A2(
							$elm$core$List$cons,
							{string: string, style: currStyle},
							revStyledStrings)),
					$elm$core$Maybe$Nothing));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundNothing = F2(
	function (_v0, string) {
		var currStyle = _v0.a;
		var revStyledStrings = _v0.b;
		return $elm$parser$Parser$Advanced$Done(
			A2(
				$elm$core$List$filter,
				function (thing) {
					return thing.string !== '';
				},
				$elm$core$List$reverse(
					A2(
						$elm$core$List$cons,
						{string: string, style: currStyle},
						revStyledStrings))));
	});
var $dillonkearns$elm_markdown$Markdown$Link$Image = function (a) {
	return {$: 'Image', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Link$Link = function (a) {
	return {$: 'Link', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Link$linkDestination = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'<',
						$elm$parser$Parser$ExpectingSymbol('<')))),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$getChompedString(
					$elm$parser$Parser$Advanced$chompUntil(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'>',
							$elm$parser$Parser$ExpectingSymbol('>')))),
				$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'>',
						$elm$parser$Parser$ExpectingSymbol('>'))))),
			A2(
			$elm$parser$Parser$Advanced$keeper,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompUntil(
					A2(
						$elm$parser$Parser$Advanced$Token,
						')',
						$elm$parser$Parser$ExpectingSymbol(')')))))
		]));
var $dillonkearns$elm_markdown$Markdown$Link$parser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						F2(
							function (alt, src) {
								return $dillonkearns$elm_markdown$Markdown$Link$Image(
									{alt: alt, src: src});
							})),
					$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'![',
							$elm$parser$Parser$ExpectingSymbol('[')))),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$getChompedString(
							$elm$parser$Parser$Advanced$chompUntil(
								A2(
									$elm$parser$Parser$Advanced$Token,
									']',
									$elm$parser$Parser$ExpectingSymbol(']')))),
						$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								']',
								$elm$parser$Parser$ExpectingSymbol(']')))),
					$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'(',
							$elm$parser$Parser$ExpectingSymbol('('))))),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$getChompedString(
					$elm$parser$Parser$Advanced$chompUntil(
						A2(
							$elm$parser$Parser$Advanced$Token,
							')',
							$elm$parser$Parser$ExpectingSymbol(')')))),
				$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						')',
						$elm$parser$Parser$ExpectingSymbol(')'))))),
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						F2(
							function (description, destination) {
								return $dillonkearns$elm_markdown$Markdown$Link$Link(
									{description: description, destination: destination, title: $elm$core$Maybe$Nothing});
							})),
					$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'[',
							$elm$parser$Parser$ExpectingSymbol('[')))),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$getChompedString(
							$elm$parser$Parser$Advanced$chompUntil(
								A2(
									$elm$parser$Parser$Advanced$Token,
									']',
									$elm$parser$Parser$ExpectingSymbol(']')))),
						$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								']',
								$elm$parser$Parser$ExpectingSymbol(']')))),
					$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'(',
							$elm$parser$Parser$ExpectingSymbol('('))))),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$dillonkearns$elm_markdown$Markdown$Link$linkDestination,
				$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						')',
						$elm$parser$Parser$ExpectingSymbol(')')))))
		]));
var $dillonkearns$elm_markdown$Markdown$Inlines$parseHelp = function (state) {
	var allFailed = state.c;
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		function (chompedString) {
			return $elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$map,
						function (link) {
							return A3($dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundLink, link, state, chompedString);
						},
						$dillonkearns$elm_markdown$Markdown$Link$parser),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v0) {
							return A2($dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundCode, state, chompedString);
						},
						$elm$parser$Parser$Advanced$token(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'`',
								$elm$parser$Parser$Expecting('`')))),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v1) {
							return A2($dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundBold, state, chompedString);
						},
						$elm$parser$Parser$Advanced$token(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'**',
								$elm$parser$Parser$Expecting('**')))),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v2) {
							return A2($dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundItalic, state, chompedString);
						},
						$elm$parser$Parser$Advanced$token(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'*',
								$elm$parser$Parser$Expecting('*')))),
						A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$elm$parser$Parser$Advanced$succeed(
								A2($dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenFoundNothing, state, chompedString)),
							$elm$parser$Parser$Advanced$end(
								$elm$parser$Parser$Expecting('End of inlines')))),
						$elm$parser$Parser$Advanced$succeed(
						A2($dillonkearns$elm_markdown$Markdown$Inlines$nextStepWhenAllFailed, state, chompedString))
					]));
		},
		function () {
			if (allFailed.$ === 'Nothing') {
				return $elm$parser$Parser$Advanced$getChompedString(
					$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Markdown$Inlines$isUninteresting));
			} else {
				var unhanldedString = allFailed.a;
				return A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed(
						function (chomped) {
							return _Utils_ap(unhanldedString, chomped);
						}),
					$elm$parser$Parser$Advanced$getChompedString(
						A2(
							$elm$parser$Parser$Advanced$chompIf,
							function (_v4) {
								return true;
							},
							$elm$parser$Parser$Expecting('*'))));
			}
		}());
};
var $dillonkearns$elm_markdown$Markdown$Inlines$parse = A2(
	$elm$parser$Parser$Advanced$loop,
	_Utils_Tuple3(
		{isBold: false, isCode: false, isItalic: false, link: $elm$core$Maybe$Nothing},
		_List_Nil,
		$elm$core$Maybe$Nothing),
	$dillonkearns$elm_markdown$Markdown$Inlines$parseHelp);
var $dillonkearns$elm_markdown$Markdown$Parser$parseRawInline = F2(
	function (wrap, _v0) {
		var unparsedInlines = _v0.a;
		var _v1 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$Inlines$parse, unparsedInlines);
		if (_v1.$ === 'Ok') {
			var styledLine = _v1.a;
			return $elm$parser$Parser$Advanced$succeed(
				wrap(styledLine));
		} else {
			var error = _v1.a;
			return $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Expecting(
					A2(
						$elm$core$String$join,
						'\n',
						A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error))));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseInlines = function (rawBlock) {
	switch (rawBlock.$) {
		case 'Heading':
			var level = rawBlock.a;
			var unparsedInlines = rawBlock.b.a;
			var _v1 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$Inlines$parse, unparsedInlines);
			if (_v1.$ === 'Ok') {
				var styledLine = _v1.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$just(
					A2($dillonkearns$elm_markdown$Markdown$Block$Heading, level, styledLine));
			} else {
				var error = _v1.a;
				return $elm$parser$Parser$Advanced$problem(
					$elm$parser$Parser$Expecting(
						A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error))));
			}
		case 'Body':
			var unparsedInlines = rawBlock.a.a;
			var _v2 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$Inlines$parse, unparsedInlines);
			if (_v2.$ === 'Ok') {
				var styledLine = _v2.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$just(
					$dillonkearns$elm_markdown$Markdown$Block$Body(styledLine));
			} else {
				var error = _v2.a;
				return $elm$parser$Parser$Advanced$problem(
					$elm$parser$Parser$Expecting(
						A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error))));
			}
		case 'Html':
			var tagName = rawBlock.a;
			var attributes = rawBlock.b;
			var children = rawBlock.c;
			return $dillonkearns$elm_markdown$Markdown$Parser$just(
				A3($dillonkearns$elm_markdown$Markdown$Block$Html, tagName, attributes, children));
		case 'ListBlock':
			var unparsedInlines = rawBlock.a;
			return A2(
				$elm$parser$Parser$Advanced$map,
				$elm$core$Maybe$Just,
				A2(
					$elm$parser$Parser$Advanced$map,
					$dillonkearns$elm_markdown$Markdown$Block$ListBlock,
					$dillonkearns$elm_markdown$Markdown$Parser$combine(
						$elm$core$List$reverse(
							A2(
								$elm$core$List$map,
								$dillonkearns$elm_markdown$Markdown$Parser$parseRawInline($elm$core$Basics$identity),
								unparsedInlines)))));
		case 'CodeBlock':
			var codeBlock = rawBlock.a;
			return $dillonkearns$elm_markdown$Markdown$Parser$just(
				$dillonkearns$elm_markdown$Markdown$Block$CodeBlock(codeBlock));
		case 'ThematicBreak':
			return $dillonkearns$elm_markdown$Markdown$Parser$just($dillonkearns$elm_markdown$Markdown$Block$ThematicBreak);
		default:
			return $elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing);
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$combineBlocks = F2(
	function (rawBlock, soFar) {
		return A2(
			$elm$parser$Parser$Advanced$andThen,
			function (parsedBlocks) {
				return A2(
					$elm$parser$Parser$Advanced$map,
					function (maybeNewParsedBlock) {
						if (maybeNewParsedBlock.$ === 'Just') {
							var newParsedBlock = maybeNewParsedBlock.a;
							return A2($elm$core$List$cons, newParsedBlock, parsedBlocks);
						} else {
							return parsedBlocks;
						}
					},
					$dillonkearns$elm_markdown$Markdown$Parser$parseInlines(rawBlock));
			},
			soFar);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines = function (rawBlocks) {
	return A3(
		$elm$core$List$foldl,
		$dillonkearns$elm_markdown$Markdown$Parser$combineBlocks,
		$elm$parser$Parser$Advanced$succeed(_List_Nil),
		rawBlocks);
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$indentedBlock = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed(
			function (body) {
				return {body: body, language: $elm$core$Maybe$Nothing};
			}),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'    ',
						$elm$parser$Parser$ExpectingSymbol('Indentation'))),
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'\t',
						$elm$parser$Parser$ExpectingSymbol('Indentation')))
				]))),
	$elm$parser$Parser$Advanced$getChompedString(
		$elm$parser$Parser$Advanced$chompUntilEndOr('\n')));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$parserHelp = function (delimeter) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					F2(
						function (language, body) {
							return {
								body: body,
								language: (language === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(language)
							};
						})),
				$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						delimeter,
						$elm$parser$Parser$ExpectingSymbol(delimeter)))),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$getChompedString(
					$elm$parser$Parser$Advanced$chompUntil(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'\n',
							$elm$parser$Parser$Problem('Expecting newline')))),
				$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'\n',
						$elm$parser$Parser$ExpectingSymbol('\n'))))),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompUntilEndOr('\n' + delimeter)),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'\n' + delimeter,
					$elm$parser$Parser$ExpectingSymbol(delimeter)))));
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$parser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$dillonkearns$elm_markdown$Markdown$CodeBlock$parserHelp('```'),
			$dillonkearns$elm_markdown$Markdown$CodeBlock$parserHelp('~~~'),
			$dillonkearns$elm_markdown$Markdown$CodeBlock$indentedBlock
		]));
var $dillonkearns$elm_markdown$Markdown$Parser$plainLine = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$succeed(
		function (rawLine) {
			return $dillonkearns$elm_markdown$Markdown$Parser$Body(
				$dillonkearns$elm_markdown$Markdown$Parser$UnparsedInlines(rawLine));
		}),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('\n')),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$chompIf,
					function (c) {
						return _Utils_eq(
							c,
							_Utils_chr('\n'));
					},
					$elm$parser$Parser$Expecting('A single non-newline char.')),
					$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('End'))
				]))));
var $dillonkearns$elm_markdown$Markdown$Parser$ThematicBreak = {$: 'ThematicBreak'};
var $dillonkearns$elm_markdown$Markdown$Parser$spaceOrTab = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || _Utils_eq(
		c,
		_Utils_chr('\t'));
};
var $dillonkearns$elm_markdown$Parser$Extra$zeroOrMore = function (condition) {
	return $elm$parser$Parser$Advanced$chompWhile(condition);
};
var $dillonkearns$elm_markdown$Markdown$Parser$thematicBreak = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$Parser$ThematicBreak),
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'   ',
								$elm$parser$Parser$Problem('Expecting 3 spaces'))),
							$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'  ',
								$elm$parser$Parser$Problem('Expecting 2 spaces'))),
							$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								' ',
								$elm$parser$Parser$Problem('Expecting space'))),
							$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
						]))),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'---',
								$elm$parser$Parser$Expecting('---'))),
						$elm$parser$Parser$Advanced$chompWhile(
							function (c) {
								return _Utils_eq(
									c,
									_Utils_chr('-'));
							})),
						A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'***',
								$elm$parser$Parser$Expecting('***'))),
						$elm$parser$Parser$Advanced$chompWhile(
							function (c) {
								return _Utils_eq(
									c,
									_Utils_chr('*'));
							})),
						A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$symbol(
							A2(
								$elm$parser$Parser$Advanced$Token,
								'___',
								$elm$parser$Parser$Expecting('___'))),
						$elm$parser$Parser$Advanced$chompWhile(
							function (c) {
								return _Utils_eq(
									c,
									_Utils_chr('_'));
							}))
					]))),
		$dillonkearns$elm_markdown$Parser$Extra$zeroOrMore($dillonkearns$elm_markdown$Markdown$Parser$spaceOrTab)),
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$elm$parser$Parser$Advanced$end(
				$elm$parser$Parser$Problem('Expecting end')),
				A2(
				$elm$parser$Parser$Advanced$chompIf,
				function (c) {
					return _Utils_eq(
						c,
						_Utils_chr('\n'));
				},
				$elm$parser$Parser$Problem('Expecting newline'))
			])));
var $elm$core$String$trim = _String_trim;
var $dillonkearns$elm_markdown$Markdown$Parser$childToParser = function (node) {
	if (node.$ === 'Element') {
		var tag = node.a;
		var attributes = node.b;
		var children = node.c;
		return A2(
			$elm$parser$Parser$Advanced$andThen,
			function (childrenAsBlocks) {
				return $elm$parser$Parser$Advanced$succeed(
					_List_fromArray(
						[
							A3($dillonkearns$elm_markdown$Markdown$Block$Html, tag, attributes, childrenAsBlocks)
						]));
			},
			$dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksParser(children));
	} else {
		var innerText = node.a;
		var _v5 = A2(
			$elm$parser$Parser$Advanced$run,
			$dillonkearns$elm_markdown$Markdown$Parser$cyclic$multiParser2(),
			innerText);
		if (_v5.$ === 'Ok') {
			var value = _v5.a;
			return $elm$parser$Parser$Advanced$succeed(value);
		} else {
			var error = _v5.a;
			return $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Expecting(
					A2(
						$elm$core$String$join,
						'\n',
						A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error))));
		}
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksParser = function (children) {
	return A2(
		$elm$parser$Parser$Advanced$map,
		$elm$core$List$concat,
		$dillonkearns$elm_markdown$Markdown$Parser$combine(
			A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$childToParser, children)));
};
var $dillonkearns$elm_markdown$Markdown$Parser$statementsHelp2 = function (revStmts) {
	var keepLooping = function (parser) {
		return A2(
			$elm$parser$Parser$Advanced$map,
			function (stmts) {
				var _v2 = _Utils_Tuple2(stmts, revStmts);
				if (((_v2.a.$ === 'Body') && _v2.b.b) && (_v2.b.a.$ === 'Body')) {
					var body1 = _v2.a.a.a;
					var _v3 = _v2.b;
					var body2 = _v3.a.a.a;
					var rest = _v3.b;
					var body2Trimmed = $elm$core$String$trim(body2);
					var body1Trimmed = $elm$core$String$trim(body1);
					return ((body1Trimmed === '') || (body2Trimmed === '')) ? $elm$parser$Parser$Advanced$Loop(
						A2(
							$elm$core$List$cons,
							$dillonkearns$elm_markdown$Markdown$Parser$Body(
								$dillonkearns$elm_markdown$Markdown$Parser$UnparsedInlines(
									_Utils_ap(body2Trimmed, body1Trimmed))),
							rest)) : $elm$parser$Parser$Advanced$Loop(
						A2(
							$elm$core$List$cons,
							$dillonkearns$elm_markdown$Markdown$Parser$Body(
								$dillonkearns$elm_markdown$Markdown$Parser$UnparsedInlines(body2Trimmed + (' ' + body1Trimmed))),
							rest));
				} else {
					return $elm$parser$Parser$Advanced$Loop(
						A2($elm$core$List$cons, stmts, revStmts));
				}
			},
			parser);
	};
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v1) {
					return $elm$parser$Parser$Advanced$Done(revStmts);
				},
				$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('End'))),
				keepLooping($dillonkearns$elm_markdown$Markdown$Parser$blankLine),
				keepLooping(
				A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$Markdown$Parser$CodeBlock, $dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
				keepLooping($dillonkearns$elm_markdown$Markdown$Parser$thematicBreak),
				keepLooping($dillonkearns$elm_markdown$Markdown$Parser$listBlock),
				keepLooping($dillonkearns$elm_markdown$Markdown$Parser$heading),
				keepLooping(
				$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser()),
				keepLooping($dillonkearns$elm_markdown$Markdown$Parser$plainLine),
				$elm$parser$Parser$Advanced$succeed(
				$elm$parser$Parser$Advanced$Done(revStmts))
			]));
};
var $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode = function (parser) {
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		function (xmlNode) {
			if (xmlNode.$ === 'Text') {
				var innerText = xmlNode.a;
				return $elm$parser$Parser$Advanced$succeed(
					$dillonkearns$elm_markdown$Markdown$Parser$Body(
						$dillonkearns$elm_markdown$Markdown$Parser$UnparsedInlines(innerText)));
			} else {
				var tag = xmlNode.a;
				var attributes = xmlNode.b;
				var children = xmlNode.c;
				return A2(
					$elm$parser$Parser$Advanced$andThen,
					function (parsedChildren) {
						return $elm$parser$Parser$Advanced$succeed(
							A3($dillonkearns$elm_markdown$Markdown$Parser$Html, tag, attributes, parsedChildren));
					},
					$dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksParser(children));
			}
		},
		parser);
};
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser() {
	return $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode($dillonkearns$elm_markdown$XmlParser$element);
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$multiParser2() {
	return A2(
		$elm$parser$Parser$Advanced$map,
		$elm$core$List$filter(
			function (item) {
				return !_Utils_eq(
					item,
					$dillonkearns$elm_markdown$Markdown$Block$Body(_List_Nil));
			}),
		A2(
			$elm$parser$Parser$Advanced$andThen,
			$dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2($elm$parser$Parser$Advanced$loop, _List_Nil, $dillonkearns$elm_markdown$Markdown$Parser$statementsHelp2),
				$elm$parser$Parser$Advanced$succeed($elm$parser$Parser$Advanced$end))));
}
try {
	var $dillonkearns$elm_markdown$Markdown$Parser$htmlParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser();
	$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser = function () {
		return $dillonkearns$elm_markdown$Markdown$Parser$htmlParser;
	};
	var $dillonkearns$elm_markdown$Markdown$Parser$multiParser2 = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$multiParser2();
	$dillonkearns$elm_markdown$Markdown$Parser$cyclic$multiParser2 = function () {
		return $dillonkearns$elm_markdown$Markdown$Parser$multiParser2;
	};
} catch ($) {
	throw 'Some top-level definitions from `Markdown.Parser` are causing infinite recursion:\n\n  ┌─────┐\n  │    childToParser\n  │     ↓\n  │    htmlParser\n  │     ↓\n  │    multiParser2\n  │     ↓\n  │    nodesToBlocksParser\n  │     ↓\n  │    statementsHelp2\n  │     ↓\n  │    xmlNodeToHtmlNode\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $dillonkearns$elm_markdown$Markdown$Parser$parse = function (input) {
	return A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$Parser$multiParser2, input);
};
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 'Err') {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 'Err') {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$combineResults = A2(
	$elm$core$List$foldr,
	$elm$core$Result$map2($elm$core$List$cons),
	$elm$core$Result$Ok(_List_Nil));
var $dillonkearns$elm_markdown$Markdown$Parser$renderHtml = F5(
	function (tagName, attributes, children, _v0, renderedChildren) {
		var htmlRenderer = _v0.a;
		return A2(
			$elm$core$Result$andThen,
			function (okChildren) {
				return A2(
					$elm$core$Result$map,
					function (myRenderer) {
						return myRenderer(okChildren);
					},
					A3(htmlRenderer, tagName, attributes, children));
			},
			$dillonkearns$elm_markdown$Markdown$Parser$combineResults(renderedChildren));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$foldThing = F3(
	function (renderer, _v0, soFar) {
		var style = _v0.style;
		var string = _v0.string;
		var _v1 = style.link;
		if (_v1.$ === 'Just') {
			var link = _v1.a;
			var _v2 = link.destination;
			if (_v2.$ === 'Link') {
				var destination = _v2.a;
				var _v3 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$Inlines$parse, string);
				if (_v3.$ === 'Ok') {
					var styledLine = _v3.a;
					return A2(
						$elm$core$List$cons,
						A2(
							$elm$core$Result$andThen,
							function (children) {
								return A2(
									renderer.link,
									{destination: destination, title: link.title},
									children);
							},
							A2($dillonkearns$elm_markdown$Markdown$Parser$renderStyled, renderer, styledLine)),
						soFar);
				} else {
					var error = _v3.a;
					return _Utils_ap(
						A2(
							$elm$core$List$map,
							$elm$core$Result$Err,
							A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error)),
						soFar);
				}
			} else {
				var src = _v2.a;
				return A2(
					$elm$core$List$cons,
					A2(
						renderer.image,
						{src: src},
						string),
					soFar);
			}
		} else {
			return style.isBold ? A2(
				$elm$core$List$cons,
				$elm$core$Result$Ok(
					renderer.bold(string)),
				soFar) : (style.isItalic ? A2(
				$elm$core$List$cons,
				$elm$core$Result$Ok(
					renderer.italic(string)),
				soFar) : (style.isCode ? A2(
				$elm$core$List$cons,
				$elm$core$Result$Ok(
					renderer.code(string)),
				soFar) : A2(
				$elm$core$List$cons,
				$elm$core$Result$Ok(
					renderer.plain(string)),
				soFar)));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$renderStyled = F2(
	function (renderer, styledStrings) {
		return $dillonkearns$elm_markdown$Markdown$Parser$combineResults(
			A3(
				$elm$core$List$foldr,
				$dillonkearns$elm_markdown$Markdown$Parser$foldThing(renderer),
				_List_Nil,
				styledStrings));
	});
var $dillonkearns$elm_markdown$Markdown$Inlines$toString = function (list) {
	return A2(
		$elm$core$String$join,
		'-',
		A2(
			$elm$core$List$map,
			function ($) {
				return $.string;
			},
			list));
};
var $dillonkearns$elm_markdown$Markdown$Parser$renderHelper = F2(
	function (renderer, blocks) {
		return A2(
			$elm$core$List$map,
			function (block) {
				switch (block.$) {
					case 'Heading':
						var level = block.a;
						var content = block.b;
						return A2(
							$elm$core$Result$map,
							function (children) {
								return renderer.heading(
									{
										children: children,
										level: level,
										rawText: $dillonkearns$elm_markdown$Markdown$Inlines$toString(content)
									});
							},
							A2($dillonkearns$elm_markdown$Markdown$Parser$renderStyled, renderer, content));
					case 'Body':
						var content = block.a;
						return A2(
							$elm$core$Result$map,
							renderer.raw,
							A2($dillonkearns$elm_markdown$Markdown$Parser$renderStyled, renderer, content));
					case 'Html':
						var tag = block.a;
						var attributes = block.b;
						var children = block.c;
						return A4($dillonkearns$elm_markdown$Markdown$Parser$renderHtmlNode, renderer, tag, attributes, children);
					case 'ListBlock':
						var items = block.a;
						return A2(
							$elm$core$Result$map,
							renderer.list,
							A2(
								$elm$core$Result$map,
								$elm$core$List$map(renderer.raw),
								$dillonkearns$elm_markdown$Markdown$Parser$combineResults(
									A2(
										$elm$core$List$map,
										$dillonkearns$elm_markdown$Markdown$Parser$renderStyled(renderer),
										items))));
					case 'CodeBlock':
						var codeBlock = block.a;
						return $elm$core$Result$Ok(
							renderer.codeBlock(codeBlock));
					default:
						return $elm$core$Result$Ok(renderer.thematicBreak);
				}
			},
			blocks);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$renderHtmlNode = F4(
	function (renderer, tag, attributes, children) {
		return A5(
			$dillonkearns$elm_markdown$Markdown$Parser$renderHtml,
			tag,
			attributes,
			children,
			renderer.html,
			A2($dillonkearns$elm_markdown$Markdown$Parser$renderHelper, renderer, children));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$render = F2(
	function (renderer, ast) {
		return $dillonkearns$elm_markdown$Markdown$Parser$combineResults(
			A2($dillonkearns$elm_markdown$Markdown$Parser$renderHelper, renderer, ast));
	});
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 'AlignY', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Top = {$: 'Top'};
var $mdgriffith$elm_ui$Element$alignTop = $mdgriffith$elm_ui$Internal$Model$AlignY($mdgriffith$elm_ui$Internal$Model$Top);
var $mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 'Class', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$bold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.bold);
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 'Text', a: a};
};
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $author$project$Main$code = function (snippet) {
	return $mdgriffith$elm_ui$Element$text(snippet);
};
var $author$project$Main$NoOp = {$: 'NoOp'};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$list_extra$List$Extra$greedyGroupsOfWithStep = F3(
	function (size, step, xs) {
		var xs_ = A2($elm$core$List$drop, step, xs);
		var okayXs = $elm$core$List$length(xs) > 0;
		var okayArgs = (size > 0) && (step > 0);
		return (okayArgs && okayXs) ? A2(
			$elm$core$List$cons,
			A2($elm$core$List$take, size, xs),
			A3($elm_community$list_extra$List$Extra$greedyGroupsOfWithStep, size, step, xs_)) : _List_Nil;
	});
var $elm_community$list_extra$List$Extra$greedyGroupsOf = F2(
	function (size, xs) {
		return A3($elm_community$list_extra$List$Extra$greedyGroupsOfWithStep, size, size, xs);
	});
var $author$project$Main$CleanBoard = {$: 'CleanBoard'};
var $author$project$Main$LoadIntoEditor = function (a) {
	return {$: 'LoadIntoEditor', a: a};
};
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Element$html = $mdgriffith$elm_ui$Internal$Model$unstyled;
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 'Empty'};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 'Styled':
				var styled = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						html: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.html, add, context));
							}),
						styles: styled.styles
					});
			case 'Unstyled':
				var html = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						$elm$core$Basics$composeL,
						$elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 'Text':
				var str = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return $mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var $mdgriffith$elm_ui$Element$map = $mdgriffith$elm_ui$Internal$Model$map;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onClick);
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Main$columnTag = F2(
	function (letter, x) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('text-anchor:middle;font-size:50px;pointer-events:none;-moz-user-select: none;'),
					$elm$svg$Svg$Attributes$x(x),
					$elm$svg$Svg$Attributes$y('870'),
					$elm$svg$Svg$Attributes$fill('#555')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(letter)
				]));
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $author$project$Main$rowTag = F2(
	function (digit, y) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$style('text-anchor:end;font-size:50px;pointer-events:none;-moz-user-select: none;'),
					$elm$svg$Svg$Attributes$x('-25'),
					$elm$svg$Svg$Attributes$y(y),
					$elm$svg$Svg$Attributes$fill('#555')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(digit)
				]));
	});
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Main$board = function (mode) {
	var decoration = function () {
		if (mode.$ === 'ShowNumbers') {
			return _List_fromArray(
				[
					A2($author$project$Main$columnTag, 'a', '50'),
					A2($author$project$Main$columnTag, 'b', '150'),
					A2($author$project$Main$columnTag, 'c', '250'),
					A2($author$project$Main$columnTag, 'd', '350'),
					A2($author$project$Main$columnTag, 'e', '450'),
					A2($author$project$Main$columnTag, 'f', '550'),
					A2($author$project$Main$columnTag, 'g', '650'),
					A2($author$project$Main$columnTag, 'h', '750'),
					A2($author$project$Main$rowTag, '1', '770'),
					A2($author$project$Main$rowTag, '2', '670'),
					A2($author$project$Main$rowTag, '3', '570'),
					A2($author$project$Main$rowTag, '4', '470'),
					A2($author$project$Main$rowTag, '5', '370'),
					A2($author$project$Main$rowTag, '6', '270'),
					A2($author$project$Main$rowTag, '7', '170'),
					A2($author$project$Main$rowTag, '8', '70')
				]);
		} else {
			return _List_Nil;
		}
	}();
	return A2(
		$elm$svg$Svg$g,
		_List_Nil,
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('-10'),
							$elm$svg$Svg$Attributes$y('-10'),
							$elm$svg$Svg$Attributes$width('820'),
							$elm$svg$Svg$Attributes$height('820'),
							$elm$svg$Svg$Attributes$fill('#242')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('0'),
							$elm$svg$Svg$Attributes$y('0'),
							$elm$svg$Svg$Attributes$width('800'),
							$elm$svg$Svg$Attributes$height('800'),
							$elm$svg$Svg$Attributes$fill('#595')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 0,0 H 800 V 100 H 0 Z M 0,200 H 800 V 300 H 0 Z M 0,400 H 800 V 500 H 0 Z M 0,600 H 800 V 700 H 0 Z M 100,0 V 800 H 200 V 0 Z M 300,0 V 800 H 400 V 0 Z M 500,0 V 800 H 600 V 0 Z M 700,0 V 800 H 800 V 0 Z'),
							$elm$svg$Svg$Attributes$fill('#9F9')
						]),
					_List_Nil)
				]),
			decoration));
};
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $author$project$Main$svgX = function (_v0) {
	var x = _v0.a;
	return x;
};
var $author$project$Main$svgY = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Main$dragHints = function (drag) {
	if (drag.$ === 'DragOff') {
		return A2($elm$svg$Svg$g, _List_Nil, _List_Nil);
	} else {
		var start = drag.a.start;
		var current = drag.a.current;
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx(
							$elm$core$String$fromInt(
								$author$project$Main$svgX(start))),
							$elm$svg$Svg$Attributes$cy(
							$elm$core$String$fromInt(
								$author$project$Main$svgY(start))),
							$elm$svg$Svg$Attributes$r('30'),
							$elm$svg$Svg$Attributes$fill('#F00')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx(
							$elm$core$String$fromInt(
								$author$project$Main$svgX(current))),
							$elm$svg$Svg$Attributes$cy(
							$elm$core$String$fromInt(
								$author$project$Main$svgY(current))),
							$elm$svg$Svg$Attributes$r('30'),
							$elm$svg$Svg$Attributes$fill('#0F0')
						]),
					_List_Nil)
				]));
	}
};
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$Pieces$blackTransform = $elm$svg$Svg$Attributes$transform('translate(100, 0) scale(-1, 1)');
var $author$project$Pieces$colorString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	return A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				'rgb(',
				$elm$core$String$fromInt(r),
				',',
				$elm$core$String$fromInt(g),
				',',
				$elm$core$String$fromInt(b),
				')'
			]));
};
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $author$project$Pieces$colorAttributes = F2(
	function (scheme, color) {
		if (color.$ === 'White') {
			return _List_fromArray(
				[
					$elm$svg$Svg$Attributes$fill(
					$author$project$Pieces$colorString(scheme.white.fill)),
					$elm$svg$Svg$Attributes$stroke(
					$author$project$Pieces$colorString(scheme.white.stroke))
				]);
		} else {
			return _List_fromArray(
				[
					$elm$svg$Svg$Attributes$fill(
					$author$project$Pieces$colorString(scheme.black.fill)),
					$elm$svg$Svg$Attributes$stroke(
					$author$project$Pieces$colorString(scheme.black.stroke)),
					$author$project$Pieces$blackTransform
				]);
		}
	});
var $author$project$Pieces$bishop = $elm$svg$Svg$Attributes$d('m 26.696068,21.204698 c -3.53426,1.506501 -9.4493,6.778101 -2.01022,7.138583 -7.14121,14.131708 -21.89121,31.628378 -6.92981,45.588946 h -5.64875 c -0.8654,0 -1.56218,0.696262 -1.56218,1.561663 v 2.827219 c 0,0.865399 0.69678,1.561661 1.56218,1.561661 h 29.1977 c 0.8654,0 1.56167,-0.696262 1.56167,-1.561661 V 75.49389 c 0,-0.865401 -0.69627,-1.561663 -1.56167,-1.561663 h -5.69681 c 9.40961,-8.0908 7.1197,-18.686478 2.54093,-28.429788 l -7.49618,8.321455 -2.19522,-5.639964 6.78615,-7.977291 c -2.39519,-4.33248 -4.83787,-8.628721 -6.5288,-12.022523 7.3903,-0.476298 2.10367,-5.036357 -2.01899,-6.979418 z m -6.68177,62.665943 c -5.09936,0.019 -10.18938,0.43883 -15.22284,1.25625 12.90965,6.103742 27.00552,9.288782 41.28533,9.328632 5.09936,-0.019 10.18939,-0.43884 15.22285,-1.25625 -12.90965,-6.10376 -27.00552,-9.288772 -41.28534,-9.328632 z');
var $author$project$Pieces$king = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$d('m 25.806488,17.925523 c -0.19325,0 -0.3488,0.347548 -0.3488,0.779279 v 1.761649 h -1.88981 c -0.32398,0 -0.58497,0.18007 -0.58497,0.403593 0,0.223525 0.26099,0.403595 0.58497,0.403595 h 1.88981 v 3.201353 h -5.92833 c -0.89879,2e-6 -1.62211,0.723336 -1.62211,1.622123 v 6.666476 c 0,0.89879 0.72332,1.622123 1.62211,1.622123 h 12.51966 c 0.89879,0 1.62211,-0.723333 1.62211,-1.622123 v -6.666476 c 0,-0.898787 -0.72332,-1.622123 -1.62211,-1.622123 h -5.8937 v -3.201353 h 1.92545 c 0.32398,0 0.58447,-0.18007 0.58447,-0.403595 0,-0.223523 -0.26049,-0.403593 -0.58447,-0.403593 h -1.92545 v -1.761649 c 0,-0.431731 -0.15557,-0.779279 -0.34883,-0.779279 z'),
		$elm$svg$Svg$Attributes$d('M 13.338792,73.974061 3.2197518,34.291521 H 9.866592 v -3.67063 h 32.043626 v 3.67063 h 6.64684 l -10.21826,40.37699 z'),
		$elm$svg$Svg$Attributes$d('m 8.7124818,71.436381 c -0.63644,0 -1.14867,0.51222 -1.14867,1.1487 v 5.41018 c 0,0.63645 0.51223,1.14867 1.14867,1.14867 H 43.128608 c 0.63644,0 1.14867,-0.51222 1.14867,-1.14867 v -5.41018 c 0,-0.63648 -0.51223,-1.1487 -1.14867,-1.1487 z m 11.3018162,12.43426 c -5.099356,0.019 -10.189326,0.43911 -15.2227862,1.25653 12.9096462,6.10374 27.0053662,9.288737 41.2851862,9.328587 5.09936,-0.019 10.18933,-0.43908 15.22279,-1.256487 -12.90965,-6.10376 -27.00537,-9.28877 -41.28519,-9.32863 z'),
		$elm$svg$Svg$Attributes$d('m 23.932178,37.992511 c -0.27345,0 -0.4935,0.22058 -0.4935,0.49403 v 5.45548 h -4.64209 c -0.17812,0 -0.32144,0.14332 -0.32144,0.32143 v 4.16357 c 0,0.17811 0.14332,0.32142 0.32144,0.32142 h 4.64209 v 11.20914 c 0,0.27345 0.22005,0.49403 0.4935,0.49403 h 3.51557 c 0.27345,0 0.4935,-0.22058 0.4935,-0.49403 v -11.20914 h 4.84053 c 0.17812,0 0.32144,-0.14331 0.32144,-0.32142 v -4.16357 c 0,-0.17811 -0.14332,-0.32143 -0.32144,-0.32143 h -4.84053 v -5.45548 c 0,-0.27345 -0.22005,-0.49403 -0.4935,-0.49403 z')
	]);
var $author$project$Pieces$knight = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$d('m 24.962006,35.562775 12.826447,-8.42334 c -8.157122,-9.85388 -44.0480342,-0.58564 -24.504261,47.57273 3.315573,8.17 11.677814,-39.14939 11.677814,-39.14939 z'),
		$elm$svg$Svg$Attributes$d('m 26.392057,18.766608 c 0,0 -2.109552,6.47342 -3.152777,9.234062 -0.350915,0.92861 -0.161849,1.210712 -2.105817,2.106332 -11.124048,5.12504 -11.713961,21.99333 -10.051065,39.436351 0.284599,2.985328 -0.63191,3.088648 -2.4887371,4.21163 -1.731854,1.047398 -2.3925503,3.374257 -1.2438512,5.743318 H 44.105705 c 0,0 -14.639571,-15.107425 -14.453381,-24.025923 0.150445,-7.206451 6.288667,-0.07671 8.135938,1.436087 1.786858,1.5636 4.15944,2.232525 6.413561,0.574124 2.005811,-1.475708 2.105797,-3.445639 0.861446,-5.6472 -1.14739,-1.280348 -5.269947,-8.570603 -5.455997,-15.219741 -2.871591,-2.775881 -3.590393,-2.329238 -5.162992,-5.714896 -0.657442,-1.415392 -0.836218,-1.747637 -2.59054,-2.134238 -0.969442,-0.213641 -1.323637,-0.06288 -2.105814,-2.105813 -0.997828,-2.606202 -3.355869,-7.894093 -3.355869,-7.894093 z m -6.377905,65.104036 c -5.099363,0.019 -10.189385,0.438832 -15.2228419,1.256255 12.9096479,6.103749 27.0055179,9.288777 41.2853339,9.328628 5.09936,-0.019 10.189382,-0.438845 15.222844,-1.256254 -12.90965,-6.103761 -27.005517,-9.28877 -41.285336,-9.328629 z')
	]);
var $author$project$Pieces$pawn = $elm$svg$Svg$Attributes$d('M 26.551366,35.36251 A 17.040858,17.040858 0 0 0 9.5108102,52.403108 17.040858,17.040858 0 0 0 26.551366,69.443631 17.040858,17.040858 0 0 0 43.59297,52.403108 17.040858,17.040858 0 0 0 26.551366,35.36251 Z M 15.446832,72.699071 c -0.636443,0 -1.148673,0.512219 -1.148673,1.148704 v 3.445996 c 0,0.636447 0.51223,1.148666 1.148673,1.148666 h 22.210115 c 0.636443,0 1.14867,-0.512219 1.14867,-1.148666 v -3.445996 c 0,-0.636485 -0.512227,-1.148704 -1.14867,-1.148704 z m 4.567466,11.17157 A 97.222517,97.222517 0 0 0 4.7915121,85.12717 97.222517,97.222517 0 0 0 46.0767,94.455765 97.222517,97.222517 0 0 0 61.299488,93.199273 97.222517,97.222517 0 0 0 20.014298,83.870641 Z');
var $author$project$Pieces$queen = $elm$svg$Svg$Attributes$d('m 27.058698,19.055487 a 4.7786435,4.7786435 0 0 0 -4.77852,4.77903 4.7786435,4.7786435 0 0 0 4.77852,4.77852 4.7786435,4.7786435 0 0 0 4.77852,-4.77852 4.7786435,4.7786435 0 0 0 -4.77852,-4.77903 z m -0.17364,13.08602 -4.91081,11.31094 -5.15834,-9.81801 -2.42931,9.81801 -7.8388,-8.35247 10.2185,37.59926 h -3.42356 c -0.63644,0 -1.14877,0.51228 -1.14877,1.14877 v 3.445786 c 0,0.63644 0.51233,1.14876 1.14877,1.14876 h 27.1203 c 0.63645,0 1.14877,-0.51232 1.14877,-1.14876 v -3.445786 c 0,-0.63649 -0.51232,-1.14877 -1.14877,-1.14877 h -3.26026 l 9.92808,-37.70416 -8.1008,8.45737 -2.42001,-9.82679 -5.09323,9.82679 z m -6.87038,51.729136 c -5.09936,0.019 -10.18939,0.43936 -15.22284,1.25678 12.90965,6.10375 27.005,9.28878 41.28482,9.32862 5.09936,-0.019 10.18938,-0.43935 15.22283,-1.25677 -12.90964,-6.10376 -27.00499,-9.28877 -41.28481,-9.32863 z');
var $author$project$Pieces$rock = $elm$svg$Svg$Attributes$d('m 8.356095,30.583977 v 35.517211 c 0.05007,1.475841 0.707492,2.557021 2.998783,2.576071 h 30.998109 c 1.403133,-0.0912 2.618372,-0.457819 2.576586,-2.660819 V 30.583977 h -3.12539 v 13.007475 h -4.39198 V 30.583977 H 30.232795 V 43.591452 H 23.221854 V 30.583977 H 15.873465 V 43.591452 H 11.650467 V 30.583977 Z m 5.063773,42.115254 c -0.636443,0 -1.148767,0.51229 -1.148767,1.14877 v 3.44578 c 0,0.63645 0.512324,1.14877 1.148767,1.14877 h 26.770975 c 0.636445,0 1.148768,-0.51232 1.148768,-1.14877 v -3.44578 c 0,-0.63648 -0.512323,-1.14877 -1.148768,-1.14877 z m 6.59443,11.17141 c -5.099362,0.019 -10.188871,0.43935 -15.222327,1.25677 12.909648,6.10374 27.005003,9.28878 41.28482,9.32863 5.099362,-0.019 10.189382,-0.43936 15.222841,-1.25677 -12.909645,-6.10376 -27.005515,-9.28877 -41.285334,-9.32863 z');
var $author$project$Pieces$figureAttribute = function (piece) {
	switch (piece.$) {
		case 'Pawn':
			return _List_fromArray(
				[$author$project$Pieces$pawn]);
		case 'Rock':
			return _List_fromArray(
				[$author$project$Pieces$rock]);
		case 'Knight':
			return $author$project$Pieces$knight;
		case 'Bishop':
			return _List_fromArray(
				[$author$project$Pieces$bishop]);
		case 'Queen':
			return _List_fromArray(
				[$author$project$Pieces$queen]);
		default:
			return $author$project$Pieces$king;
	}
};
var $author$project$Pieces$shape = F2(
	function (attributes, dAttribute) {
		return A2(
			$elm$svg$Svg$path,
			A2($elm$core$List$cons, dAttribute, attributes),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$Pieces$unify = function (elements) {
	if (elements.b && (!elements.b.b)) {
		var single = elements.a;
		return single;
	} else {
		var multiple = elements;
		return A2($elm$svg$Svg$g, _List_Nil, multiple);
	}
};
var $author$project$Pieces$figure = F3(
	function (scheme, piece, color) {
		var attributes = A2(
			$elm$core$List$cons,
			$elm$svg$Svg$Attributes$strokeWidth('2'),
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$strokeLinejoin('round'),
				A2($author$project$Pieces$colorAttributes, scheme, color)));
		return $author$project$Pieces$unify(
			A2(
				$elm$core$List$map,
				$author$project$Pieces$shape(attributes),
				$author$project$Pieces$figureAttribute(piece)));
	});
var $author$project$Main$tileX = function (_v0) {
	var x = _v0.a;
	return x;
};
var $author$project$Main$tileY = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Main$pieceSvg = F2(
	function (colorScheme, piece) {
		var transform = $elm$svg$Svg$Attributes$transform(
			'translate(' + ($elm$core$String$fromInt(
				100 * $author$project$Main$tileX(piece.position)) + (', ' + ($elm$core$String$fromInt(
				700 - (100 * $author$project$Main$tileY(piece.position))) + ')'))));
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[transform]),
			_List_fromArray(
				[
					A3($author$project$Pieces$figure, colorScheme, piece.pieceType, piece.color)
				]));
	});
var $author$project$Main$sortBlacksFirst = function (pieces) {
	return _Utils_ap(
		A2(
			$elm$core$List$filter,
			function (piece) {
				return _Utils_eq(piece.color, $author$project$Sako$Black);
			},
			pieces),
		A2(
			$elm$core$List$filter,
			function (piece) {
				return _Utils_eq(piece.color, $author$project$Sako$White);
			},
			pieces));
};
var $author$project$Main$piecesSvg = F2(
	function (colorScheme, pacoPosition) {
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			A2(
				$elm$core$List$map,
				$author$project$Main$pieceSvg(colorScheme),
				$author$project$Main$sortBlacksFirst(pacoPosition.pieces)));
	});
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Main$viewBox = function (rect) {
	return $elm$svg$Svg$Attributes$viewBox(
		A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					$elm$core$String$fromFloat(rect.x),
					$elm$core$String$fromFloat(rect.y),
					$elm$core$String$fromFloat(rect.width),
					$elm$core$String$fromFloat(rect.height)
				])));
};
var $author$project$Main$positionSvg = function (config) {
	var idAttribute = function () {
		var _v0 = config.nodeId;
		if (_v0.$ === 'Just') {
			var nodeId = _v0.a;
			return _List_fromArray(
				[
					$elm$svg$Svg$Attributes$id(nodeId)
				]);
		} else {
			return _List_Nil;
		}
	}();
	var attributes = _Utils_ap(
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromInt(config.sideLength)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromInt(config.sideLength)),
				$author$project$Main$viewBox(
				$author$project$Main$boardViewBox(config.viewMode))
			]),
		idAttribute);
	return A2(
		$elm$svg$Svg$svg,
		attributes,
		_List_fromArray(
			[
				$author$project$Main$board(config.viewMode),
				$author$project$Main$dragHints(config.drag),
				A2($author$project$Main$piecesSvg, config.colorScheme, config.position)
			]));
};
var $author$project$Main$loadPositionPreview = F2(
	function (taco, position) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Events$onClick(
					$author$project$Main$LoadIntoEditor(position))
				]),
			A2(
				$mdgriffith$elm_ui$Element$map,
				$author$project$Main$EditorMsgWrapper,
				$mdgriffith$elm_ui$Element$html(
					$author$project$Main$positionSvg(
						{colorScheme: taco.colorScheme, drag: $author$project$Main$DragOff, nodeId: $elm$core$Maybe$Nothing, position: position, sideLength: 250, viewMode: $author$project$Main$CleanBoard}))));
	});
var $mdgriffith$elm_ui$Internal$Model$AsRow = {$: 'AsRow'};
var $mdgriffith$elm_ui$Internal$Model$asRow = $mdgriffith$elm_ui$Internal$Model$AsRow;
var $mdgriffith$elm_ui$Element$row = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asRow,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentLeft + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.contentCenterY)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 'SpacingStyle', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 'StyleClass', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $author$project$Main$codeBlock = F2(
	function (taco, details) {
		var _v0 = A2($elm$parser$Parser$run, $author$project$Main$parseLibrary, details.body);
		if (_v0.$ === 'Err') {
			return $mdgriffith$elm_ui$Element$text('There is an error in the position notation :-(');
		} else {
			var positions = _v0.a;
			var positionPreviews = A2(
				$elm$core$List$map,
				$author$project$Main$loadPositionPreview(taco),
				positions);
			var rows = A2($elm_community$list_extra$List$Extra$greedyGroupsOf, 3, positionPreviews);
			return A2(
				$mdgriffith$elm_ui$Element$map,
				function (_v1) {
					return $author$project$Main$EditorMsgWrapper($author$project$Main$NoOp);
				},
				A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(10),
							$mdgriffith$elm_ui$Element$centerX
						]),
					A2(
						$elm$core$List$map,
						function (group) {
							return A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$spacing(10)
									]),
								group);
						},
						rows)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 'Colored', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $mdgriffith$elm_ui$Internal$Flag$fontAlignment = $mdgriffith$elm_ui$Internal$Flag$flag(12);
var $mdgriffith$elm_ui$Element$Font$center = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.textCenter);
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 'FontFamily', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 'Serif':
						return 'serif';
					case 'SansSerif':
						return 'sans-serif';
					case 'Monospace':
						return 'monospace';
					case 'Typeface':
						var name = font.a;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 'ImportFont':
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.name;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Element$Font$family = function (families) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontFamily,
		A2(
			$mdgriffith$elm_ui$Internal$Model$FontFamily,
			A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'ff-', families),
			families));
};
var $mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 'Describe', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Heading = function (a) {
	return {$: 'Heading', a: a};
};
var $mdgriffith$elm_ui$Element$Region$heading = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Describe, $mdgriffith$elm_ui$Internal$Model$Heading);
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 'Paragraph'};
var $mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asParagraph,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Main$rawTextToId = function (rawText) {
	return A3(
		$elm$core$String$replace,
		' ',
		'',
		$elm$core$String$toLower(rawText));
};
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 'FontSize', a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontSize,
		$mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 'Typeface', a: a};
};
var $mdgriffith$elm_ui$Element$Font$typeface = $mdgriffith$elm_ui$Internal$Model$Typeface;
var $author$project$Main$heading = function (_v0) {
	var level = _v0.level;
	var rawText = _v0.rawText;
	var children = _v0.children;
	return A2(
		$mdgriffith$elm_ui$Element$paragraph,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$size(
				function () {
					switch (level) {
						case 1:
							return 36;
						case 2:
							return 24;
						default:
							return 20;
					}
				}()),
				$mdgriffith$elm_ui$Element$Font$bold,
				$mdgriffith$elm_ui$Element$Font$family(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$typeface('Montserrat')
					])),
				$mdgriffith$elm_ui$Element$Region$heading(level),
				$mdgriffith$elm_ui$Element$htmlAttribute(
				A2(
					$elm$html$Html$Attributes$attribute,
					'name',
					$author$project$Main$rawTextToId(rawText))),
				$mdgriffith$elm_ui$Element$Font$center,
				$mdgriffith$elm_ui$Element$htmlAttribute(
				$elm$html$Html$Attributes$id(
					$author$project$Main$rawTextToId(rawText)))
			]),
		children);
};
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $mdgriffith$elm_ui$Element$image = F2(
	function (attrs, _v0) {
		var src = _v0.src;
		var description = _v0.description;
		var imageAttributes = A2(
			$elm$core$List$filter,
			function (a) {
				switch (a.$) {
					case 'Width':
						return true;
					case 'Height':
						return true;
					default:
						return false;
				}
			},
			attrs);
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.imageContainer),
				attrs),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asEl,
						$mdgriffith$elm_ui$Internal$Model$NodeName('img'),
						_Utils_ap(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$src(src)),
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$alt(description))
								]),
							imageAttributes),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil))
					])));
	});
var $mdgriffith$elm_ui$Element$Font$italic = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.italic);
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $mdgriffith$elm_ui$Element$newTabLink = F2(
	function (attrs, _v0) {
		var url = _v0.url;
		var label = _v0.label;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$NodeName('a'),
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Attr(
					$elm$html$Html$Attributes$href(url)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$Attr(
						$elm$html$Html$Attributes$rel('noopener noreferrer')),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Attributes$target('_blank')),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentCenterX + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.link)))),
									attrs)))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Element$none = $mdgriffith$elm_ui$Internal$Model$Empty;
var $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer = function (a) {
	return {$: 'HtmlRenderer', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Html$resultOr = F2(
	function (ra, rb) {
		if (ra.$ === 'Err') {
			var singleError = ra.a;
			if (rb.$ === 'Ok') {
				var okValue = rb.a;
				return $elm$core$Result$Ok(okValue);
			} else {
				var errorsSoFar = rb.a;
				return $elm$core$Result$Err(
					A2($elm$core$List$cons, singleError, errorsSoFar));
			}
		} else {
			var okValue = ra.a;
			return $elm$core$Result$Ok(okValue);
		}
	});
var $dillonkearns$elm_markdown$Markdown$Html$attributesToString = function (attributes) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (_v0) {
				var name = _v0.name;
				var value = _v0.value;
				return name + ('=\"' + (value + '\"'));
			},
			attributes));
};
var $dillonkearns$elm_markdown$Markdown$Html$tagToString = F2(
	function (tagName, attributes) {
		return $elm$core$List$isEmpty(attributes) ? ('<' + (tagName + '>')) : ('<' + (tagName + (' ' + ($dillonkearns$elm_markdown$Markdown$Html$attributesToString(attributes) + '>'))));
	});
var $dillonkearns$elm_markdown$Markdown$Html$oneOf = function (decoders) {
	var unwrappedDecoders = A2(
		$elm$core$List$map,
		function (_v1) {
			var rawDecoder = _v1.a;
			return rawDecoder;
		},
		decoders);
	return function (rawDecoder) {
		return $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer(
			F3(
				function (tagName, attributes, innerBlocks) {
					return A2(
						$elm$core$Result$mapError,
						function (errors) {
							if (!errors.b) {
								return 'Ran into a oneOf with no possibilities!';
							} else {
								if (!errors.b.b) {
									var singleError = errors.a;
									return 'Problem with the given value:\n\n' + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ('\n\n' + (singleError + '\n')));
								} else {
									return 'oneOf failed parsing this value:\n    ' + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ('\n\nParsing failed in the following 2 ways:\n\n\n' + (A2(
										$elm$core$String$join,
										'\n\n',
										A2(
											$elm$core$List$indexedMap,
											F2(
												function (index, error) {
													return '(' + ($elm$core$String$fromInt(index + 1) + (') ' + error));
												}),
											errors)) + '\n')));
								}
							}
						},
						A3(rawDecoder, tagName, attributes, innerBlocks));
				}));
	}(
		A3(
			$elm$core$List$foldl,
			F2(
				function (decoder, soFar) {
					return F3(
						function (tagName, attributes, children) {
							return A2(
								$dillonkearns$elm_markdown$Markdown$Html$resultOr,
								A3(decoder, tagName, attributes, children),
								A3(soFar, tagName, attributes, children));
						});
				}),
			F3(
				function (tagName, attributes, children) {
					return $elm$core$Result$Err(_List_Nil);
				}),
			unwrappedDecoders));
};
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 'Rgba', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Element$rgb255 = F3(
	function (red, green, blue) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, 1);
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$renderer = function (taco) {
	return {
		bold: function (content) {
			return A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$Font$bold]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$text(content)
					]));
		},
		code: $author$project$Main$code,
		codeBlock: $author$project$Main$codeBlock(taco),
		heading: $author$project$Main$heading,
		html: $dillonkearns$elm_markdown$Markdown$Html$oneOf(_List_Nil),
		image: F2(
			function (image, body) {
				return $elm$core$Result$Ok(
					A2(
						$mdgriffith$elm_ui$Element$image,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							]),
						{description: body, src: image.src}));
			}),
		italic: function (content) {
			return A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$Font$italic]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$text(content)
					]));
		},
		link: F2(
			function (_v0, body) {
				var title = _v0.title;
				var destination = _v0.destination;
				return $elm$core$Result$Ok(
					A2(
						$mdgriffith$elm_ui$Element$newTabLink,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$htmlAttribute(
								A2($elm$html$Html$Attributes$style, 'display', 'inline-flex'))
							]),
						{
							label: A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$color(
										A3($mdgriffith$elm_ui$Element$rgb255, 0, 0, 255))
									]),
								body),
							url: destination
						}));
			}),
		list: function (items) {
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(15)
					]),
				A2(
					$elm$core$List$map,
					function (itemBlocks) {
						return A2(
							$mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$alignTop]),
									$mdgriffith$elm_ui$Element$text('•')),
									itemBlocks
								]));
					},
					items));
		},
		plain: $mdgriffith$elm_ui$Element$text,
		raw: $mdgriffith$elm_ui$Element$paragraph(
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(15)
				])),
		thematicBreak: $mdgriffith$elm_ui$Element$none
	};
};
var $author$project$Main$markdownView = F2(
	function (taco, content) {
		return A2(
			$elm$core$Result$andThen,
			$dillonkearns$elm_markdown$Markdown$Parser$render(
				$author$project$Main$renderer(taco)),
			A2(
				$elm$core$Result$mapError,
				function (error) {
					return A2(
						$elm$core$String$join,
						'\n',
						A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error));
				},
				$dillonkearns$elm_markdown$Markdown$Parser$parse(content)));
	});
var $mdgriffith$elm_ui$Internal$Model$Max = F2(
	function (a, b) {
		return {$: 'Max', a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$maximum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Max, i, l);
	});
var $mdgriffith$elm_ui$Element$Input$TextArea = {$: 'TextArea'};
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 'NoAttribute'};
var $mdgriffith$elm_ui$Internal$Model$LivePolite = {$: 'LivePolite'};
var $mdgriffith$elm_ui$Element$Region$announce = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$LivePolite);
var $mdgriffith$elm_ui$Element$Input$applyLabel = F3(
	function (attrs, label, input) {
		if (label.$ === 'HiddenLabel') {
			var labelText = label.a;
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asColumn,
				$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
				attrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[input])));
		} else {
			var position = label.a;
			var labelAttrs = label.b;
			var labelChild = label.c;
			var labelElement = A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				labelAttrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[labelChild])));
			switch (position.$) {
				case 'Above':
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
				case 'Below':
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				case 'OnRight':
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				default:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
			}
		}
	});
var $mdgriffith$elm_ui$Element$Input$autofill = A2(
	$elm$core$Basics$composeL,
	$mdgriffith$elm_ui$Internal$Model$Attr,
	$elm$html$Html$Attributes$attribute('autocomplete'));
var $mdgriffith$elm_ui$Internal$Model$Behind = {$: 'Behind'};
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 'Nearby', a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$createNearby = F2(
	function (loc, element) {
		if (element.$ === 'Empty') {
			return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
		} else {
			return A2($mdgriffith$elm_ui$Internal$Model$Nearby, loc, element);
		}
	});
var $mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, $mdgriffith$elm_ui$Internal$Model$Behind, element);
};
var $mdgriffith$elm_ui$Internal$Model$MoveY = function (a) {
	return {$: 'MoveY', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 'TransformComponent', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$moveY = $mdgriffith$elm_ui$Internal$Flag$flag(26);
var $mdgriffith$elm_ui$Element$moveUp = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(-y));
};
var $mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding = function (attrs) {
	var gatherSpacing = F2(
		function (attr, found) {
			if ((attr.$ === 'StyleClass') && (attr.b.$ === 'SpacingStyle')) {
				var _v2 = attr.b;
				var x = _v2.b;
				var y = _v2.c;
				if (found.$ === 'Nothing') {
					return $elm$core$Maybe$Just(y);
				} else {
					return found;
				}
			} else {
				return found;
			}
		});
	var _v0 = A3($elm$core$List$foldr, gatherSpacing, $elm$core$Maybe$Nothing, attrs);
	if (_v0.$ === 'Nothing') {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		var vSpace = _v0.a;
		return $mdgriffith$elm_ui$Element$moveUp(vSpace / 2);
	}
};
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.clip);
var $mdgriffith$elm_ui$Internal$Flag$cursor = $mdgriffith$elm_ui$Internal$Flag$flag(21);
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Flag$borderColor = $mdgriffith$elm_ui$Internal$Flag$flag(28);
var $mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var $mdgriffith$elm_ui$Element$rgb = F3(
	function (r, g, b) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, r, g, b, 1);
	});
var $mdgriffith$elm_ui$Element$Input$darkGrey = A3($mdgriffith$elm_ui$Element$rgb, 186 / 255, 189 / 255, 182 / 255);
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 'PaddingStyle', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		return _Utils_eq(x, y) ? A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + $elm$core$String$fromInt(x),
				x,
				x,
				x,
				x)) : A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $mdgriffith$elm_ui$Element$Input$defaultTextPadding = A2($mdgriffith$elm_ui$Element$paddingXY, 12, 12);
var $mdgriffith$elm_ui$Internal$Flag$borderRound = $mdgriffith$elm_ui$Internal$Flag$flag(17);
var $mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + $elm$core$String$fromInt(radius),
			'border-radius',
			$elm$core$String$fromInt(radius) + 'px'));
};
var $mdgriffith$elm_ui$Element$Input$white = A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
var $mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 'BorderWidth', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + $elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var $mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Input$defaultTextPadding,
		$mdgriffith$elm_ui$Element$Border$rounded(3),
		$mdgriffith$elm_ui$Element$Border$color($mdgriffith$elm_ui$Element$Input$darkGrey),
		$mdgriffith$elm_ui$Element$Background$color($mdgriffith$elm_ui$Element$Input$white),
		$mdgriffith$elm_ui$Element$Border$width(1),
		$mdgriffith$elm_ui$Element$spacing(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink)
	]);
var $mdgriffith$elm_ui$Element$Input$getHeight = function (attr) {
	if (attr.$ === 'Height') {
		var h = attr.a;
		return $elm$core$Maybe$Just(h);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Label = function (a) {
	return {$: 'Label', a: a};
};
var $mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute = function (label) {
	if (label.$ === 'HiddenLabel') {
		var textLabel = label.a;
		return $mdgriffith$elm_ui$Internal$Model$Describe(
			$mdgriffith$elm_ui$Internal$Model$Label(textLabel));
	} else {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	}
};
var $mdgriffith$elm_ui$Internal$Model$InFront = {$: 'InFront'};
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, $mdgriffith$elm_ui$Internal$Model$InFront, element);
};
var $mdgriffith$elm_ui$Element$Input$isConstrained = function (len) {
	isConstrained:
	while (true) {
		switch (len.$) {
			case 'Content':
				return false;
			case 'Px':
				return true;
			case 'Fill':
				return true;
			case 'Min':
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isConstrained;
			default:
				var l = len.b;
				return true;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isHiddenLabel = function (label) {
	if (label.$ === 'HiddenLabel') {
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$isStacked = function (label) {
	if (label.$ === 'Label') {
		var loc = label.a;
		switch (loc.$) {
			case 'OnRight':
				return false;
			case 'OnLeft':
				return false;
			case 'Above':
				return true;
			default:
				return true;
		}
	} else {
		return true;
	}
};
var $mdgriffith$elm_ui$Element$Input$negateBox = function (box) {
	return {bottom: -box.bottom, left: -box.left, right: -box.right, top: -box.top};
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left)))))));
	});
var $mdgriffith$elm_ui$Element$paddingEach = function (_v0) {
	var top = _v0.top;
	var right = _v0.right;
	var bottom = _v0.bottom;
	var left = _v0.left;
	return (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) ? A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(top),
			top,
			top,
			top,
			top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			A4($mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
			top,
			right,
			bottom,
			left));
};
var $mdgriffith$elm_ui$Element$Input$isFill = function (len) {
	isFill:
	while (true) {
		switch (len.$) {
			case 'Fill':
				return true;
			case 'Content':
				return false;
			case 'Px':
				return false;
			case 'Min':
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isPixel = function (len) {
	isPixel:
	while (true) {
		switch (len.$) {
			case 'Content':
				return false;
			case 'Px':
				return true;
			case 'Fill':
				return false;
			case 'Min':
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$redistributeOver = F4(
	function (isMultiline, stacked, attr, els) {
		switch (attr.$) {
			case 'Nearby':
				return _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					});
			case 'Width':
				var width = attr.a;
				return stacked ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent)
					}) : ($mdgriffith$elm_ui$Element$Input$isFill(width) ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent),
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : ($mdgriffith$elm_ui$Element$Input$isPixel(width) ? _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					})));
			case 'Height':
				var height = attr.a;
				return (!stacked) ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent),
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : ($mdgriffith$elm_ui$Element$Input$isFill(height) ? _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent),
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : ($mdgriffith$elm_ui$Element$Input$isPixel(height) ? _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					}) : _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					})));
			case 'AlignX':
				return _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent)
					});
			case 'AlignY':
				return _Utils_update(
					els,
					{
						fullParent: A2($elm$core$List$cons, attr, els.fullParent)
					});
			case 'StyleClass':
				switch (attr.b.$) {
					case 'SpacingStyle':
						var _v1 = attr.b;
						return _Utils_update(
							els,
							{
								fullParent: A2($elm$core$List$cons, attr, els.fullParent),
								input: A2($elm$core$List$cons, attr, els.input),
								parent: A2($elm$core$List$cons, attr, els.parent),
								wrapper: A2($elm$core$List$cons, attr, els.wrapper)
							});
					case 'PaddingStyle':
						var cls = attr.a;
						var _v2 = attr.b;
						var pad = _v2.a;
						var t = _v2.b;
						var r = _v2.c;
						var b = _v2.d;
						var l = _v2.e;
						if (isMultiline) {
							return _Utils_update(
								els,
								{
									cover: A2($elm$core$List$cons, attr, els.cover),
									parent: A2($elm$core$List$cons, attr, els.parent)
								});
						} else {
							var reducedVerticalPadding = $mdgriffith$elm_ui$Element$paddingEach(
								{
									bottom: b - A2($elm$core$Basics$min, t, b),
									left: l,
									right: r,
									top: t - A2($elm$core$Basics$min, t, b)
								});
							var newLineHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'line-height',
									'calc(1.0em + ' + ($elm$core$String$fromInt(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'height',
									'calc(1.0em + ' + ($elm$core$String$fromInt(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							return _Utils_update(
								els,
								{
									cover: A2($elm$core$List$cons, attr, els.cover),
									input: A2(
										$elm$core$List$cons,
										newHeight,
										A2($elm$core$List$cons, newLineHeight, els.input)),
									parent: A2($elm$core$List$cons, reducedVerticalPadding, els.parent)
								});
						}
					case 'BorderWidth':
						var _v3 = attr.b;
						return _Utils_update(
							els,
							{
								cover: A2($elm$core$List$cons, attr, els.cover),
								parent: A2($elm$core$List$cons, attr, els.parent)
							});
					case 'Transform':
						return _Utils_update(
							els,
							{
								cover: A2($elm$core$List$cons, attr, els.cover),
								parent: A2($elm$core$List$cons, attr, els.parent)
							});
					case 'FontSize':
						return _Utils_update(
							els,
							{
								fullParent: A2($elm$core$List$cons, attr, els.fullParent)
							});
					case 'FontFamily':
						var _v4 = attr.b;
						return _Utils_update(
							els,
							{
								fullParent: A2($elm$core$List$cons, attr, els.fullParent)
							});
					default:
						var flag = attr.a;
						var cls = attr.b;
						return _Utils_update(
							els,
							{
								parent: A2($elm$core$List$cons, attr, els.parent)
							});
				}
			case 'NoAttribute':
				return els;
			case 'Attr':
				var a = attr.a;
				return _Utils_update(
					els,
					{
						input: A2($elm$core$List$cons, attr, els.input)
					});
			case 'Describe':
				return _Utils_update(
					els,
					{
						input: A2($elm$core$List$cons, attr, els.input)
					});
			case 'Class':
				return _Utils_update(
					els,
					{
						parent: A2($elm$core$List$cons, attr, els.parent)
					});
			default:
				return _Utils_update(
					els,
					{
						input: A2($elm$core$List$cons, attr, els.input)
					});
		}
	});
var $mdgriffith$elm_ui$Element$Input$redistribute = F3(
	function (isMultiline, stacked, attrs) {
		return function (redist) {
			return {
				cover: $elm$core$List$reverse(redist.cover),
				fullParent: $elm$core$List$reverse(redist.fullParent),
				input: $elm$core$List$reverse(redist.input),
				parent: $elm$core$List$reverse(redist.parent),
				wrapper: $elm$core$List$reverse(redist.wrapper)
			};
		}(
			A3(
				$elm$core$List$foldl,
				A2($mdgriffith$elm_ui$Element$Input$redistributeOver, isMultiline, stacked),
				{cover: _List_Nil, fullParent: _List_Nil, input: _List_Nil, parent: _List_Nil, wrapper: _List_Nil},
				attrs));
	});
var $mdgriffith$elm_ui$Element$Input$renderBox = function (_v0) {
	var top = _v0.top;
	var right = _v0.right;
	var bottom = _v0.bottom;
	var left = _v0.left;
	return $elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px'))))));
};
var $mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 'Transparency', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$transparency = $mdgriffith$elm_ui$Internal$Flag$flag(0);
var $mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			$elm$core$Basics$min,
			1.0,
			A2($elm$core$Basics$max, 0.0, o)));
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + $mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var $mdgriffith$elm_ui$Element$Input$charcoal = A3($mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var $mdgriffith$elm_ui$Element$rgba = $mdgriffith$elm_ui$Internal$Model$Rgba;
var $mdgriffith$elm_ui$Element$Input$renderPlaceholder = F3(
	function (_v0, forPlaceholder, on) {
		var placeholderAttrs = _v0.a;
		var placeholderEl = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				forPlaceholder,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color($mdgriffith$elm_ui$Element$Input$charcoal),
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.noTextSelection + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.passPointerEvents)),
							$mdgriffith$elm_ui$Element$clip,
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$alpha(
							on ? 1 : 0)
						]),
					placeholderAttrs)),
			placeholderEl);
	});
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.scrollbarsY);
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $mdgriffith$elm_ui$Element$Input$spellcheck = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$spellcheck);
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $mdgriffith$elm_ui$Element$Input$value = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$value);
var $mdgriffith$elm_ui$Element$Input$textHelper = F3(
	function (textInput, attrs, textOptions) {
		var withDefaults = _Utils_ap($mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var redistributed = A3(
			$mdgriffith$elm_ui$Element$Input$redistribute,
			_Utils_eq(textInput.type_, $mdgriffith$elm_ui$Element$Input$TextArea),
			$mdgriffith$elm_ui$Element$Input$isStacked(textOptions.label),
			withDefaults);
		var onlySpacing = function (attr) {
			if ((attr.$ === 'StyleClass') && (attr.b.$ === 'SpacingStyle')) {
				var _v9 = attr.b;
				return true;
			} else {
				return false;
			}
		};
		var heightConstrained = function () {
			var _v7 = textInput.type_;
			if (_v7.$ === 'TextInputNode') {
				var inputType = _v7.a;
				return false;
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						$mdgriffith$elm_ui$Element$Input$isConstrained,
						$elm$core$List$head(
							$elm$core$List$reverse(
								A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Element$Input$getHeight, withDefaults)))));
			}
		}();
		var getPadding = function (attr) {
			if ((attr.$ === 'StyleClass') && (attr.b.$ === 'PaddingStyle')) {
				var cls = attr.a;
				var _v6 = attr.b;
				var pad = _v6.a;
				var t = _v6.b;
				var r = _v6.c;
				var b = _v6.d;
				var l = _v6.e;
				return $elm$core$Maybe$Just(
					{
						bottom: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(b - 3)),
						left: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(l - 3)),
						right: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(r - 3)),
						top: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(t - 3))
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var parentPadding = A2(
			$elm$core$Maybe$withDefault,
			{bottom: 0, left: 0, right: 0, top: 0},
			$elm$core$List$head(
				$elm$core$List$reverse(
					A2($elm$core$List$filterMap, getPadding, withDefaults))));
		var inputElement = A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			function () {
				var _v3 = textInput.type_;
				if (_v3.$ === 'TextInputNode') {
					var inputType = _v3.a;
					return $mdgriffith$elm_ui$Internal$Model$NodeName('input');
				} else {
					return $mdgriffith$elm_ui$Internal$Model$NodeName('textarea');
				}
			}(),
			_Utils_ap(
				function () {
					var _v4 = textInput.type_;
					if (_v4.$ === 'TextInputNode') {
						var inputType = _v4.a;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_(inputType)),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputText)
							]);
					} else {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputMultiline),
								$mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding(withDefaults),
								$mdgriffith$elm_ui$Element$paddingEach(parentPadding),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2(
									$elm$html$Html$Attributes$style,
									'margin',
									$mdgriffith$elm_ui$Element$Input$renderBox(
										$mdgriffith$elm_ui$Element$Input$negateBox(parentPadding)))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$style, 'box-sizing', 'content-box'))
							]);
					}
				}(),
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Input$value(textOptions.text),
							$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Events$onInput(textOptions.onChange)),
							$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.label),
							$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.spellchecked),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Internal$Model$NoAttribute,
							A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Input$autofill, textInput.autofill))
						]),
					redistributed.input)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil));
		var wrappedInput = function () {
			var _v0 = textInput.type_;
			if (_v0.$ === 'TextArea') {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_Utils_ap(
						(heightConstrained ? $elm$core$List$cons($mdgriffith$elm_ui$Element$scrollbarY) : $elm$core$Basics$identity)(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.focusedWithin),
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineWrapper)
								])),
						redistributed.parent),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asParagraph,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Element$inFront(inputElement),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineParent),
												redistributed.wrapper)))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(
									function () {
										if (textOptions.text === '') {
											var _v1 = textOptions.placeholder;
											if (_v1.$ === 'Nothing') {
												return _List_fromArray(
													[
														$mdgriffith$elm_ui$Element$text('\u00A0')
													]);
											} else {
												var place = _v1.a;
												return _List_fromArray(
													[
														A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, _List_Nil, textOptions.text === '')
													]);
											}
										} else {
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Internal$Model$unstyled(
													A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.inputMultilineFiller)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(textOptions.text + '\u00A0')
															])))
												]);
										}
									}()))
							])));
			} else {
				var inputType = _v0.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.focusedWithin),
							$elm$core$List$concat(
								_List_fromArray(
									[
										redistributed.parent,
										function () {
										var _v2 = textOptions.placeholder;
										if (_v2.$ === 'Nothing') {
											return _List_Nil;
										} else {
											var place = _v2.a;
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Element$behindContent(
													A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, redistributed.cover, textOptions.text === ''))
												]);
										}
									}()
									])))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[inputElement])));
			}
		}();
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				$elm$core$List$cons,
				A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.cursorText),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.label) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Element$spacing(5),
					A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$Region$announce, redistributed.fullParent))),
			textOptions.label,
			wrappedInput);
	});
var $mdgriffith$elm_ui$Element$Input$multiline = F2(
	function (attrs, multi) {
		return A3(
			$mdgriffith$elm_ui$Element$Input$textHelper,
			{autofill: $elm$core$Maybe$Nothing, spellchecked: multi.spellcheck, type_: $mdgriffith$elm_ui$Element$Input$TextArea},
			attrs,
			{label: multi.label, onChange: multi.onChange, placeholder: multi.placeholder, text: multi.text});
	});
var $mdgriffith$elm_ui$Element$padding = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			x,
			x,
			x,
			x));
};
var $author$project$Main$LibraryPage = {$: 'LibraryPage'};
var $author$project$Main$OpenPage = function (a) {
	return {$: 'OpenPage', a: a};
};
var $author$project$Main$pageHeaderButton = F2(
	function (attributes, _v0) {
		var currentPage = _v0.currentPage;
		var targetPage = _v0.targetPage;
		var caption = _v0.caption;
		return _Utils_eq(currentPage, targetPage) ? A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$padding(10),
						$mdgriffith$elm_ui$Element$Background$color(
						A3($mdgriffith$elm_ui$Element$rgb255, 200, 200, 200))
					]),
				attributes),
			$mdgriffith$elm_ui$Element$text(caption)) : A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$padding(10),
						$mdgriffith$elm_ui$Element$Events$onClick(
						$author$project$Main$OpenPage(targetPage))
					]),
				attributes),
			$mdgriffith$elm_ui$Element$text(caption));
	});
var $author$project$Main$pageHeader = function (currentPage) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$Background$color(
				A3($mdgriffith$elm_ui$Element$rgb255, 230, 230, 230))
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Main$pageHeaderButton,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$Font$bold]),
				{caption: 'Paco Ŝako Tools', currentPage: currentPage, targetPage: $author$project$Main$MainPage}),
				A2(
				$author$project$Main$pageHeaderButton,
				_List_Nil,
				{caption: 'Position Editor', currentPage: currentPage, targetPage: $author$project$Main$EditorPage}),
				A2(
				$author$project$Main$pageHeaderButton,
				_List_Nil,
				{caption: 'Example Positions', currentPage: currentPage, targetPage: $author$project$Main$LibraryPage}),
				A2(
				$author$project$Main$pageHeaderButton,
				_List_Nil,
				{caption: 'Blog Editor', currentPage: currentPage, targetPage: $author$project$Main$BlogPage}),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$padding(10),
						$mdgriffith$elm_ui$Element$Font$color(
						A3($mdgriffith$elm_ui$Element$rgb255, 200, 150, 150)),
						$mdgriffith$elm_ui$Element$Font$bold
					]),
				$mdgriffith$elm_ui$Element$text('Your data will not be saved!'))
			]));
};
var $mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 'Px', a: a};
};
var $mdgriffith$elm_ui$Element$px = $mdgriffith$elm_ui$Internal$Model$Px;
var $author$project$Main$blogUi = F2(
	function (taco, blog) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					$author$project$Main$pageHeader($author$project$Main$BlogPage),
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$Input$multiline,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(600))
								]),
							{
								label: $mdgriffith$elm_ui$Element$Input$labelHidden('Markdown input'),
								onChange: A2($elm$core$Basics$composeR, $author$project$Main$OnMarkdownInput, $author$project$Main$BlogMsgWrapper),
								placeholder: $elm$core$Maybe$Nothing,
								spellcheck: false,
								text: blog.text
							}),
							function () {
							var _v0 = A2($author$project$Main$markdownView, taco, blog.text);
							if (_v0.$ === 'Ok') {
								var rendered = _v0.a;
								return A2(
									$mdgriffith$elm_ui$Element$column,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$spacing(30),
											$mdgriffith$elm_ui$Element$padding(80),
											$mdgriffith$elm_ui$Element$width(
											A2($mdgriffith$elm_ui$Element$maximum, 1000, $mdgriffith$elm_ui$Element$fill)),
											$mdgriffith$elm_ui$Element$centerX
										]),
									rendered);
							} else {
								var errors = _v0.a;
								return $mdgriffith$elm_ui$Element$text(errors);
							}
						}()
						]))
				]));
	});
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $lattyware$elm_fontawesome$FontAwesome$Styles$css = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('svg:not(:root).svg-inline--fa {  overflow: visible;}.svg-inline--fa {  display: inline-block;  font-size: inherit;  height: 1em;  overflow: visible;  vertical-align: -0.125em;}.svg-inline--fa.fa-lg {  vertical-align: -0.225em;}.svg-inline--fa.fa-w-1 {  width: 0.0625em;}.svg-inline--fa.fa-w-2 {  width: 0.125em;}.svg-inline--fa.fa-w-3 {  width: 0.1875em;}.svg-inline--fa.fa-w-4 {  width: 0.25em;}.svg-inline--fa.fa-w-5 {  width: 0.3125em;}.svg-inline--fa.fa-w-6 {  width: 0.375em;}.svg-inline--fa.fa-w-7 {  width: 0.4375em;}.svg-inline--fa.fa-w-8 {  width: 0.5em;}.svg-inline--fa.fa-w-9 {  width: 0.5625em;}.svg-inline--fa.fa-w-10 {  width: 0.625em;}.svg-inline--fa.fa-w-11 {  width: 0.6875em;}.svg-inline--fa.fa-w-12 {  width: 0.75em;}.svg-inline--fa.fa-w-13 {  width: 0.8125em;}.svg-inline--fa.fa-w-14 {  width: 0.875em;}.svg-inline--fa.fa-w-15 {  width: 0.9375em;}.svg-inline--fa.fa-w-16 {  width: 1em;}.svg-inline--fa.fa-w-17 {  width: 1.0625em;}.svg-inline--fa.fa-w-18 {  width: 1.125em;}.svg-inline--fa.fa-w-19 {  width: 1.1875em;}.svg-inline--fa.fa-w-20 {  width: 1.25em;}.svg-inline--fa.fa-pull-left {  margin-right: 0.3em;  width: auto;}.svg-inline--fa.fa-pull-right {  margin-left: 0.3em;  width: auto;}.svg-inline--fa.fa-border {  height: 1.5em;}.svg-inline--fa.fa-li {  width: 2em;}.svg-inline--fa.fa-fw {  width: 1.25em;}.fa-layers svg.svg-inline--fa {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;}.fa-layers {  display: inline-block;  height: 1em;  position: relative;  text-align: center;  vertical-align: -0.125em;  width: 1em;}.fa-layers svg.svg-inline--fa {  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-counter, .fa-layers-text {  display: inline-block;  position: absolute;  text-align: center;}.fa-layers-text {  left: 50%;  top: 50%;  -webkit-transform: translate(-50%, -50%);          transform: translate(-50%, -50%);  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-counter {  background-color: #ff253a;  border-radius: 1em;  -webkit-box-sizing: border-box;          box-sizing: border-box;  color: #fff;  height: 1.5em;  line-height: 1;  max-width: 5em;  min-width: 1.5em;  overflow: hidden;  padding: 0.25em;  right: 0;  text-overflow: ellipsis;  top: 0;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-bottom-right {  bottom: 0;  right: 0;  top: auto;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: bottom right;          transform-origin: bottom right;}.fa-layers-bottom-left {  bottom: 0;  left: 0;  right: auto;  top: auto;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: bottom left;          transform-origin: bottom left;}.fa-layers-top-right {  right: 0;  top: 0;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-top-left {  left: 0;  right: auto;  top: 0;  -webkit-transform: scale(0.25);          transform: scale(0.25);  -webkit-transform-origin: top left;          transform-origin: top left;}.fa-lg {  font-size: 1.3333333333em;  line-height: 0.75em;  vertical-align: -0.0667em;}.fa-xs {  font-size: 0.75em;}.fa-sm {  font-size: 0.875em;}.fa-1x {  font-size: 1em;}.fa-2x {  font-size: 2em;}.fa-3x {  font-size: 3em;}.fa-4x {  font-size: 4em;}.fa-5x {  font-size: 5em;}.fa-6x {  font-size: 6em;}.fa-7x {  font-size: 7em;}.fa-8x {  font-size: 8em;}.fa-9x {  font-size: 9em;}.fa-10x {  font-size: 10em;}.fa-fw {  text-align: center;  width: 1.25em;}.fa-ul {  list-style-type: none;  margin-left: 2.5em;  padding-left: 0;}.fa-ul > li {  position: relative;}.fa-li {  left: -2em;  position: absolute;  text-align: center;  width: 2em;  line-height: inherit;}.fa-border {  border: solid 0.08em #eee;  border-radius: 0.1em;  padding: 0.2em 0.25em 0.15em;}.fa-pull-left {  float: left;}.fa-pull-right {  float: right;}.fa.fa-pull-left,.fas.fa-pull-left,.far.fa-pull-left,.fal.fa-pull-left,.fab.fa-pull-left {  margin-right: 0.3em;}.fa.fa-pull-right,.fas.fa-pull-right,.far.fa-pull-right,.fal.fa-pull-right,.fab.fa-pull-right {  margin-left: 0.3em;}.fa-spin {  -webkit-animation: fa-spin 2s infinite linear;          animation: fa-spin 2s infinite linear;}.fa-pulse {  -webkit-animation: fa-spin 1s infinite steps(8);          animation: fa-spin 1s infinite steps(8);}@-webkit-keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}@keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}.fa-rotate-90 {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";  -webkit-transform: rotate(90deg);          transform: rotate(90deg);}.fa-rotate-180 {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";  -webkit-transform: rotate(180deg);          transform: rotate(180deg);}.fa-rotate-270 {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";  -webkit-transform: rotate(270deg);          transform: rotate(270deg);}.fa-flip-horizontal {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";  -webkit-transform: scale(-1, 1);          transform: scale(-1, 1);}.fa-flip-vertical {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";  -webkit-transform: scale(1, -1);          transform: scale(1, -1);}.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";  -webkit-transform: scale(-1, -1);          transform: scale(-1, -1);}:root .fa-rotate-90,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-flip-both {  -webkit-filter: none;          filter: none;}.fa-stack {  display: inline-block;  height: 2em;  position: relative;  width: 2.5em;}.fa-stack-1x,.fa-stack-2x {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;}.svg-inline--fa.fa-stack-1x {  height: 1em;  width: 1.25em;}.svg-inline--fa.fa-stack-2x {  height: 2em;  width: 2.5em;}.fa-inverse {  color: #fff;}.sr-only {  border: 0;  clip: rect(0, 0, 0, 0);  height: 1px;  margin: -1px;  overflow: hidden;  padding: 0;  position: absolute;  width: 1px;}.sr-only-focusable:active, .sr-only-focusable:focus {  clip: auto;  height: auto;  margin: 0;  overflow: visible;  position: static;  width: auto;}.svg-inline--fa .fa-primary {  fill: var(--fa-primary-color, currentColor);  opacity: 1;  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa .fa-secondary {  fill: var(--fa-secondary-color, currentColor);  opacity: 0.4;  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-primary {  opacity: 0.4;  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-secondary {  opacity: 1;  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary {  fill: black;}.fad.fa-inverse {  color: #fff;}')
		]));
var $author$project$Main$MouseDown = function (a) {
	return {$: 'MouseDown', a: a};
};
var $author$project$Main$MouseMove = function (a) {
	return {$: 'MouseMove', a: a};
};
var $author$project$Main$MouseUp = function (a) {
	return {$: 'MouseUp', a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterY = {$: 'CenterY'};
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY($mdgriffith$elm_ui$Internal$Model$CenterY);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'screenX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'screenY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7($elm$json$Json$Decode$map6, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, $mpizenberg$elm_pointer_events$Internal$Decode$keys, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, $mpizenberg$elm_pointer_events$Internal$Decode$clientPos, $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, $mpizenberg$elm_pointer_events$Internal$Decode$pagePos, $mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousemove', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseup', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $author$project$Main$windowSafetyMargin = 50;
var $author$project$Main$positionView = F4(
	function (taco, editor, position, drag) {
		var _v0 = editor.windowSize;
		var windowHeight = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(windowHeight)),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$centerX
				]),
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
				$mdgriffith$elm_ui$Element$html(
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown($author$project$Main$MouseDown),
								$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove($author$project$Main$MouseMove),
								$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp($author$project$Main$MouseUp),
								$elm$html$Html$Attributes$id('boardDiv')
							]),
						_List_fromArray(
							[
								$author$project$Main$positionSvg(
								{
									colorScheme: taco.colorScheme,
									drag: drag,
									nodeId: $elm$core$Maybe$Just($author$project$Main$sakoEditorId),
									position: position,
									sideLength: windowHeight - $author$project$Main$windowSafetyMargin,
									viewMode: editor.viewMode
								})
							])))));
	});
var $author$project$Main$DownloadPng = {$: 'DownloadPng'};
var $author$project$Main$DownloadSvg = {$: 'DownloadSvg'};
var $mdgriffith$elm_ui$Internal$Model$Right = {$: 'Right'};
var $mdgriffith$elm_ui$Element$alignRight = $mdgriffith$elm_ui$Internal$Model$AlignX($mdgriffith$elm_ui$Internal$Model$Right);
var $author$project$Main$BlackSideColor = function (a) {
	return {$: 'BlackSideColor', a: a};
};
var $author$project$Pieces$bluePieceColor = {
	fill: _Utils_Tuple3(50, 50, 255),
	stroke: _Utils_Tuple3(50, 50, 150)
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$Icon = F5(
	function (prefix, name, width, height, path) {
		return {height: height, name: name, path: path, prefix: prefix, width: width};
	});
var $lattyware$elm_fontawesome$FontAwesome$Regular$circle = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'far', 'circle', 512, 512, 'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z');
var $author$project$Pieces$colorUi = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	return A3($mdgriffith$elm_ui$Element$rgb255, r, g, b);
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$Presentation = function (a) {
	return {$: 'Presentation', a: a};
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$present = function (icon) {
	return $lattyware$elm_fontawesome$FontAwesome$Icon$Presentation(
		{attributes: _List_Nil, icon: icon, id: $elm$core$Maybe$Nothing, outer: $elm$core$Maybe$Nothing, role: 'img', title: $elm$core$Maybe$Nothing, transforms: _List_Nil});
};
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add = F2(
	function (transform, combined) {
		switch (transform.$) {
			case 'Scale':
				var direction = transform.a;
				var amount = function () {
					if (direction.$ === 'Grow') {
						var by = direction.a;
						return by;
					} else {
						var by = direction.a;
						return -by;
					}
				}();
				return _Utils_update(
					combined,
					{size: combined.size + amount});
			case 'Reposition':
				var direction = transform.a;
				var _v2 = function () {
					switch (direction.$) {
						case 'Up':
							var by = direction.a;
							return _Utils_Tuple2(0, -by);
						case 'Down':
							var by = direction.a;
							return _Utils_Tuple2(0, by);
						case 'Left':
							var by = direction.a;
							return _Utils_Tuple2(-by, 0);
						default:
							var by = direction.a;
							return _Utils_Tuple2(by, 0);
					}
				}();
				var x = _v2.a;
				var y = _v2.b;
				return _Utils_update(
					combined,
					{x: combined.x + x, y: combined.y + y});
			case 'Rotate':
				var rotation = transform.a;
				return _Utils_update(
					combined,
					{rotate: combined.rotate + rotation});
			default:
				if (transform.a.$ === 'Vertical') {
					var _v4 = transform.a;
					return _Utils_update(
						combined,
						{flipX: true});
				} else {
					var _v5 = transform.a;
					return _Utils_update(
						combined,
						{flipY: true});
				}
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize = 16;
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform = {flipX: false, flipY: false, rotate: 0, size: $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize, x: 0, y: 0};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine = function (transforms) {
	return A3($elm$core$List$foldl, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform, transforms);
};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform = function (transforms) {
	var combined = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine(transforms);
	return _Utils_eq(combined, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(combined);
};
var $elm$svg$Svg$title = $elm$svg$Svg$trustedNode('title');
var $lattyware$elm_fontawesome$FontAwesome$Icon$titledContents = F3(
	function (titleId, contents, title) {
		return A2(
			$elm$core$List$cons,
			A2(
				$elm$svg$Svg$title,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id(titleId)
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(title)
					])),
			contents);
	});
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg = F3(
	function (containerWidth, iconWidth, transform) {
		var path = 'translate(' + ($elm$core$String$fromFloat((iconWidth / 2) * (-1)) + ' -256)');
		var outer = 'translate(' + ($elm$core$String$fromFloat(containerWidth / 2) + ' 256)');
		var innerTranslate = 'translate(' + ($elm$core$String$fromFloat(transform.x * 32) + (',' + ($elm$core$String$fromFloat(transform.y * 32) + ') ')));
		var innerRotate = 'rotate(' + ($elm$core$String$fromFloat(transform.rotate) + ' 0 0)');
		var flipY = transform.flipY ? (-1) : 1;
		var scaleY = (transform.size / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipY;
		var flipX = transform.flipX ? (-1) : 1;
		var scaleX = (transform.size / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipX;
		var innerScale = 'scale(' + ($elm$core$String$fromFloat(scaleX) + (', ' + ($elm$core$String$fromFloat(scaleY) + ') ')));
		return {
			inner: $elm$svg$Svg$Attributes$transform(
				_Utils_ap(
					innerTranslate,
					_Utils_ap(innerScale, innerRotate))),
			outer: $elm$svg$Svg$Attributes$transform(outer),
			path: $elm$svg$Svg$Attributes$transform(path)
		};
	});
var $lattyware$elm_fontawesome$FontAwesome$Icon$allSpace = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$x('0'),
		$elm$svg$Svg$Attributes$y('0'),
		$elm$svg$Svg$Attributes$width('100%'),
		$elm$svg$Svg$Attributes$height('100%')
	]);
var $elm$svg$Svg$clipPath = $elm$svg$Svg$trustedNode('clipPath');
var $elm$svg$Svg$Attributes$clipPath = _VirtualDom_attribute('clip-path');
var $lattyware$elm_fontawesome$FontAwesome$Icon$corePath = F2(
	function (attrs, icon) {
		return A2(
			$elm$svg$Svg$path,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$fill('currentColor'),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$d(icon.path),
					attrs)),
			_List_Nil);
	});
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$mask = $elm$svg$Svg$trustedNode('mask');
var $elm$svg$Svg$Attributes$mask = _VirtualDom_attribute('mask');
var $elm$svg$Svg$Attributes$maskContentUnits = _VirtualDom_attribute('maskContentUnits');
var $elm$svg$Svg$Attributes$maskUnits = _VirtualDom_attribute('maskUnits');
var $lattyware$elm_fontawesome$FontAwesome$Icon$viewMaskedWithTransform = F4(
	function (id, transforms, inner, outer) {
		var maskInnerGroup = A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[transforms.inner]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							transforms.path,
							$elm$svg$Svg$Attributes$fill('black'),
							$elm$svg$Svg$Attributes$d(inner.path)
						]),
					_List_Nil)
				]));
		var maskId = 'mask-' + (inner.name + ('-' + id));
		var maskTag = A2(
			$elm$svg$Svg$mask,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id(maskId),
						$elm$svg$Svg$Attributes$maskUnits('userSpaceOnUse'),
						$elm$svg$Svg$Attributes$maskContentUnits('userSpaceOnUse')
					]),
				$lattyware$elm_fontawesome$FontAwesome$Icon$allSpace),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$fill('white'),
						$lattyware$elm_fontawesome$FontAwesome$Icon$allSpace),
					_List_Nil),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[transforms.outer]),
					_List_fromArray(
						[maskInnerGroup]))
				]));
		var clipId = 'clip-' + (outer.name + ('-' + id));
		var defs = A2(
			$elm$svg$Svg$defs,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$clipPath,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$id(clipId)
						]),
					_List_fromArray(
						[
							A2($lattyware$elm_fontawesome$FontAwesome$Icon$corePath, _List_Nil, outer)
						])),
					maskTag
				]));
		return _List_fromArray(
			[
				defs,
				A2(
				$elm$svg$Svg$rect,
				$elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								$elm$svg$Svg$Attributes$fill('currentColor'),
								$elm$svg$Svg$Attributes$clipPath('url(#' + (clipId + ')')),
								$elm$svg$Svg$Attributes$mask('url(#' + (maskId + ')'))
							]),
							$lattyware$elm_fontawesome$FontAwesome$Icon$allSpace
						])),
				_List_Nil)
			]);
	});
var $lattyware$elm_fontawesome$FontAwesome$Icon$viewWithTransform = F2(
	function (transforms, icon) {
		if (transforms.$ === 'Just') {
			var ts = transforms.a;
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[ts.outer]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[ts.inner]),
						_List_fromArray(
							[
								A2(
								$lattyware$elm_fontawesome$FontAwesome$Icon$corePath,
								_List_fromArray(
									[ts.path]),
								icon)
							]))
					]));
		} else {
			return A2($lattyware$elm_fontawesome$FontAwesome$Icon$corePath, _List_Nil, icon);
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Icon$internalView = function (_v0) {
	var icon = _v0.a.icon;
	var attributes = _v0.a.attributes;
	var transforms = _v0.a.transforms;
	var role = _v0.a.role;
	var id = _v0.a.id;
	var title = _v0.a.title;
	var outer = _v0.a.outer;
	var alwaysId = A2($elm$core$Maybe$withDefault, icon.name, id);
	var titleId = alwaysId + '-title';
	var semantics = A2(
		$elm$core$Maybe$withDefault,
		A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$always(
				A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', titleId)),
			title));
	var _v1 = A2(
		$elm$core$Maybe$withDefault,
		_Utils_Tuple2(icon.width, icon.height),
		A2(
			$elm$core$Maybe$map,
			function (o) {
				return _Utils_Tuple2(o.width, o.height);
			},
			outer));
	var width = _v1.a;
	var height = _v1.b;
	var classes = _List_fromArray(
		[
			'svg-inline--fa',
			'fa-' + icon.name,
			'fa-w-' + $elm$core$String$fromInt(
			$elm$core$Basics$ceiling((width / height) * 16))
		]);
	var svgTransform = A2(
		$elm$core$Maybe$map,
		A2($lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg, width, icon.width),
		$lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform(transforms));
	var contents = function () {
		var resolvedSvgTransform = A2(
			$elm$core$Maybe$withDefault,
			A3($lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg, width, icon.width, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform),
			svgTransform);
		return A2(
			$elm$core$Maybe$withDefault,
			_List_fromArray(
				[
					A2($lattyware$elm_fontawesome$FontAwesome$Icon$viewWithTransform, svgTransform, icon)
				]),
			A2(
				$elm$core$Maybe$map,
				A3($lattyware$elm_fontawesome$FontAwesome$Icon$viewMaskedWithTransform, alwaysId, resolvedSvgTransform, icon),
				outer));
	}();
	var potentiallyTitledContents = A2(
		$elm$core$Maybe$withDefault,
		contents,
		A2(
			$elm$core$Maybe$map,
			A2($lattyware$elm_fontawesome$FontAwesome$Icon$titledContents, titleId, contents),
			title));
	return A2(
		$elm$svg$Svg$svg,
		$elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'role', role),
						A2($elm$html$Html$Attributes$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
						$elm$svg$Svg$Attributes$viewBox(
						'0 0 ' + ($elm$core$String$fromInt(width) + (' ' + $elm$core$String$fromInt(height)))),
						semantics
					]),
					A2($elm$core$List$map, $elm$svg$Svg$Attributes$class, classes),
					attributes
				])),
		potentiallyTitledContents);
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$view = function (presentation) {
	return $lattyware$elm_fontawesome$FontAwesome$Icon$internalView(presentation);
};
var $lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon = A2($elm$core$Basics$composeR, $lattyware$elm_fontawesome$FontAwesome$Icon$present, $lattyware$elm_fontawesome$FontAwesome$Icon$view);
var $author$project$Main$icon = F2(
	function (attributes, iconType) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			attributes,
			$mdgriffith$elm_ui$Element$html(
				$lattyware$elm_fontawesome$FontAwesome$Icon$viewIcon(iconType)));
	});
var $lattyware$elm_fontawesome$FontAwesome$Solid$yinYang = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'yin-yang', 496, 512, 'M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm0 376c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0-128c-53.02 0-96 42.98-96 96s42.98 96 96 96c-106.04 0-192-85.96-192-192S141.96 64 248 64c53.02 0 96 42.98 96 96s-42.98 96-96 96zm0-128c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z');
var $author$project$Main$colorPicker = F3(
	function (msg, currentColor, newColor) {
		var iconChoice = _Utils_eq(currentColor, newColor) ? $lattyware$elm_fontawesome$FontAwesome$Solid$yinYang : $lattyware$elm_fontawesome$FontAwesome$Regular$circle;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$Events$onClick(
					msg(newColor)),
					$mdgriffith$elm_ui$Element$padding(5),
					$mdgriffith$elm_ui$Element$Background$color(
					$author$project$Pieces$colorUi(newColor.stroke))
				]),
			A2(
				$author$project$Main$icon,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$Font$color(
						$author$project$Pieces$colorUi(newColor.fill))
					]),
				iconChoice));
	});
var $author$project$Pieces$greenPieceColor = {
	fill: _Utils_Tuple3(50, 255, 50),
	stroke: _Utils_Tuple3(50, 150, 50)
};
var $author$project$Pieces$orangePieceColor = {
	fill: _Utils_Tuple3(255, 150, 50),
	stroke: _Utils_Tuple3(150, 100, 50)
};
var $author$project$Pieces$pinkPieceColor = {
	fill: _Utils_Tuple3(255, 50, 255),
	stroke: _Utils_Tuple3(150, 50, 150)
};
var $author$project$Pieces$purplePieceColor = {
	fill: _Utils_Tuple3(150, 0, 255),
	stroke: _Utils_Tuple3(140, 0, 150)
};
var $author$project$Pieces$redPieceColor = {
	fill: _Utils_Tuple3(255, 50, 50),
	stroke: _Utils_Tuple3(150, 50, 50)
};
var $mdgriffith$elm_ui$Internal$Model$Padding = F5(
	function (a, b, c, d, e) {
		return {$: 'Padding', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Model$Spaced = F3(
	function (a, b, c) {
		return {$: 'Spaced', a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (attr, _v0) {
				var pad = _v0.a;
				var spacing = _v0.b;
				return _Utils_Tuple2(
					function () {
						if (pad.$ === 'Just') {
							var x = pad.a;
							return pad;
						} else {
							if ((attr.$ === 'StyleClass') && (attr.b.$ === 'PaddingStyle')) {
								var _v3 = attr.b;
								var name = _v3.a;
								var t = _v3.b;
								var r = _v3.c;
								var b = _v3.d;
								var l = _v3.e;
								return $elm$core$Maybe$Just(
									A5($mdgriffith$elm_ui$Internal$Model$Padding, name, t, r, b, l));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}(),
					function () {
						if (spacing.$ === 'Just') {
							var x = spacing.a;
							return spacing;
						} else {
							if ((attr.$ === 'StyleClass') && (attr.b.$ === 'SpacingStyle')) {
								var _v6 = attr.b;
								var name = _v6.a;
								var x = _v6.b;
								var y = _v6.c;
								return $elm$core$Maybe$Just(
									A3($mdgriffith$elm_ui$Internal$Model$Spaced, name, x, y));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}());
			}),
		_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
		attrs);
};
var $mdgriffith$elm_ui$Element$wrappedRow = F2(
	function (attrs, children) {
		var _v0 = $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding(attrs);
		var padded = _v0.a;
		var spaced = _v0.b;
		if (spaced.$ === 'Nothing') {
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asRow,
				$mdgriffith$elm_ui$Internal$Model$div,
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentLeft + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.wrapped)))),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
							attrs))),
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
		} else {
			var _v2 = spaced.a;
			var spaceName = _v2.a;
			var x = _v2.b;
			var y = _v2.c;
			var newPadding = function () {
				if (padded.$ === 'Just') {
					var _v5 = padded.a;
					var name = _v5.a;
					var t = _v5.b;
					var r = _v5.c;
					var b = _v5.d;
					var l = _v5.e;
					return ((_Utils_cmp(r, (x / 2) | 0) > -1) && (_Utils_cmp(b, (y / 2) | 0) > -1)) ? $elm$core$Maybe$Just(
						$mdgriffith$elm_ui$Element$paddingEach(
							{bottom: b - ((y / 2) | 0), left: l - ((x / 2) | 0), right: r - ((x / 2) | 0), top: t - ((y / 2) | 0)})) : $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}();
			if (newPadding.$ === 'Just') {
				var pad = newPadding.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asRow,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentLeft + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.wrapped)))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
								_Utils_ap(
									attrs,
									_List_fromArray(
										[pad]))))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
			} else {
				var halfY = -(y / 2);
				var halfX = -(x / 2);
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					attrs,
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asRow,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentLeft + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.wrapped)))),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											A2(
												$elm$html$Html$Attributes$style,
												'margin',
												$elm$core$String$fromFloat(halfY) + ('px' + (' ' + ($elm$core$String$fromFloat(halfX) + 'px'))))),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Internal$Model$Attr(
												A2(
													$elm$html$Html$Attributes$style,
													'width',
													'calc(100% + ' + ($elm$core$String$fromInt(x) + 'px)'))),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$Attr(
													A2(
														$elm$html$Html$Attributes$style,
														'height',
														'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))),
												A2(
													$elm$core$List$cons,
													A2(
														$mdgriffith$elm_ui$Internal$Model$StyleClass,
														$mdgriffith$elm_ui$Internal$Flag$spacing,
														A3($mdgriffith$elm_ui$Internal$Model$SpacingStyle, spaceName, x, y)),
													_List_Nil))))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(children))
							])));
			}
		}
	});
var $author$project$Pieces$yellowPieceColor = {
	fill: _Utils_Tuple3(255, 255, 50),
	stroke: _Utils_Tuple3(150, 150, 50)
};
var $author$project$Main$colorSchemeConfigBlack = function (taco) {
	return A2(
		$mdgriffith$elm_ui$Element$wrappedRow,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$whitePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$redPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$orangePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$yellowPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$greenPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$bluePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$purplePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$pinkPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$BlackSideColor, taco.colorScheme.black, $author$project$Pieces$blackPieceColor)
			]));
};
var $author$project$Main$WhiteSideColor = function (a) {
	return {$: 'WhiteSideColor', a: a};
};
var $author$project$Main$colorSchemeConfigWhite = function (taco) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$whitePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$redPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$orangePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$yellowPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$greenPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$bluePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$purplePieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$pinkPieceColor),
				A3($author$project$Main$colorPicker, $author$project$Main$WhiteSideColor, taco.colorScheme.white, $author$project$Pieces$blackPieceColor)
			]));
};
var $author$project$Main$colorSchemeConfig = function (taco) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(5)
			]),
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$text('Piece colors'),
				$author$project$Main$colorSchemeConfigWhite(taco),
				$author$project$Main$colorSchemeConfigBlack(taco)
			]));
};
var $author$project$Main$UpdateUserPaste = function (a) {
	return {$: 'UpdateUserPaste', a: a};
};
var $author$project$Main$tileFlat = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return x + (8 * y);
};
var $author$project$Main$pacoPositionAsGrid = function (pieces) {
	var colorTiles = function (filterColor) {
		return $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (piece) {
					return _Utils_Tuple2(
						$author$project$Main$tileFlat(piece.position),
						piece.pieceType);
				},
				A2(
					$elm$core$List$filter,
					function (piece) {
						return _Utils_eq(piece.color, filterColor);
					},
					pieces)));
	};
	return A6(
		$elm$core$Dict$merge,
		F3(
			function (i, w, dict) {
				return A3(
					$elm$core$Dict$insert,
					i,
					$author$project$Main$WhiteTile(w),
					dict);
			}),
		F4(
			function (i, w, b, dict) {
				return A3(
					$elm$core$Dict$insert,
					i,
					A2($author$project$Main$PairTile, w, b),
					dict);
			}),
		F3(
			function (i, b, dict) {
				return A3(
					$elm$core$Dict$insert,
					i,
					$author$project$Main$BlackTile(b),
					dict);
			}),
		colorTiles($author$project$Sako$White),
		colorTiles($author$project$Sako$Black),
		$elm$core$Dict$empty);
};
var $author$project$Main$markdownTypeChar = function (pieceType) {
	switch (pieceType.$) {
		case 'Pawn':
			return 'P';
		case 'Rock':
			return 'R';
		case 'Knight':
			return 'N';
		case 'Bishop':
			return 'B';
		case 'Queen':
			return 'Q';
		default:
			return 'K';
	}
};
var $author$project$Main$tileStateAsString = function (tileState) {
	switch (tileState.$) {
		case 'EmptyTile':
			return '..';
		case 'WhiteTile':
			var w = tileState.a;
			return $author$project$Main$markdownTypeChar(w) + '.';
		case 'BlackTile':
			var b = tileState.a;
			return '.' + $author$project$Main$markdownTypeChar(b);
		default:
			var w = tileState.a;
			var b = tileState.b;
			return _Utils_ap(
				$author$project$Main$markdownTypeChar(w),
				$author$project$Main$markdownTypeChar(b));
	}
};
var $author$project$Main$markdownExchangeNotation = function (pieces) {
	var indices = _List_fromArray(
		[
			_List_fromArray(
			[56, 57, 58, 59, 60, 61, 62, 63]),
			_List_fromArray(
			[48, 49, 50, 51, 52, 53, 54, 55]),
			_List_fromArray(
			[40, 41, 42, 43, 44, 45, 46, 47]),
			_List_fromArray(
			[32, 33, 34, 35, 36, 37, 38, 39]),
			_List_fromArray(
			[24, 25, 26, 27, 28, 29, 30, 31]),
			_List_fromArray(
			[16, 17, 18, 19, 20, 21, 22, 23]),
			_List_fromArray(
			[8, 9, 10, 11, 12, 13, 14, 15]),
			_List_fromArray(
			[0, 1, 2, 3, 4, 5, 6, 7])
		]);
	var dictRepresentation = $author$project$Main$pacoPositionAsGrid(pieces);
	var tileEntry = function (i) {
		return $author$project$Main$tileStateAsString(
			A2(
				$elm$core$Maybe$withDefault,
				$author$project$Main$EmptyTile,
				A2($elm$core$Dict$get, i, dictRepresentation)));
	};
	var markdownRow = function (indexRow) {
		return A2(
			$elm$core$String$join,
			' ',
			A2($elm$core$List$map, tileEntry, indexRow));
	};
	return A2(
		$elm$core$String$join,
		'\n',
		A2($elm$core$List$map, markdownRow, indices));
};
var $mdgriffith$elm_ui$Internal$Model$Monospace = {$: 'Monospace'};
var $mdgriffith$elm_ui$Element$Font$monospace = $mdgriffith$elm_ui$Internal$Model$Monospace;
var $author$project$Main$UseUserPaste = function (a) {
	return {$: 'UseUserPaste', a: a};
};
var $author$project$Main$parsedMarkdownPaste = F2(
	function (taco, model) {
		var _v0 = model.pasteParsed;
		switch (_v0.$) {
			case 'NoInput':
				return $mdgriffith$elm_ui$Element$none;
			case 'ParseError':
				var error = _v0.a;
				return $mdgriffith$elm_ui$Element$text(error);
			default:
				var pacoPosition = _v0.a;
				return A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Events$onClick(
							$author$project$Main$UseUserPaste(pacoPosition)),
							$mdgriffith$elm_ui$Element$spacing(5)
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$html(
							$author$project$Main$positionSvg(
								{colorScheme: taco.colorScheme, drag: $author$project$Main$DragOff, nodeId: $elm$core$Maybe$Nothing, position: pacoPosition, sideLength: 100, viewMode: $author$project$Main$CleanBoard})),
							$mdgriffith$elm_ui$Element$text('Load')
						]));
		}
	});
var $mdgriffith$elm_ui$Element$Input$Placeholder = F2(
	function (a, b) {
		return {$: 'Placeholder', a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$Input$placeholder = $mdgriffith$elm_ui$Element$Input$Placeholder;
var $author$project$Main$markdownCopyPaste = F2(
	function (taco, model) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(5)
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text('Text notation you can store'),
					A2(
					$mdgriffith$elm_ui$Element$Input$multiline,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$family(
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$monospace]))
						]),
					{
						label: $mdgriffith$elm_ui$Element$Input$labelHidden('Copy this to a text document for later use.'),
						onChange: function (_v0) {
							return $author$project$Main$NoOp;
						},
						placeholder: $elm$core$Maybe$Nothing,
						spellcheck: false,
						text: $author$project$Main$markdownExchangeNotation(
							$yotamDvir$elm_pivot$Pivot$getC(model.game).pieces)
					}),
					$mdgriffith$elm_ui$Element$text('Recover state from notation'),
					A2(
					$mdgriffith$elm_ui$Element$Input$multiline,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$family(
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$monospace]))
						]),
					{
						label: $mdgriffith$elm_ui$Element$Input$labelHidden('Paste level notation as you see above.'),
						onChange: $author$project$Main$UpdateUserPaste,
						placeholder: $elm$core$Maybe$Just(
							A2(
								$mdgriffith$elm_ui$Element$Input$placeholder,
								_List_Nil,
								$mdgriffith$elm_ui$Element$text('Paste level notation.'))),
						spellcheck: false,
						text: model.userPaste
					}),
					A2($author$project$Main$parsedMarkdownPaste, taco, model)
				]));
	});
var $author$project$Main$Redo = {$: 'Redo'};
var $lattyware$elm_fontawesome$FontAwesome$Solid$arrowRight = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'arrow-right', 448, 512, 'M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z');
var $mdgriffith$elm_ui$Internal$Model$Button = {$: 'Button'};
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 'StyleClass') && (attr.b.$ === 'PseudoSelector')) && (attr.b.a.$ === 'Focus')) {
		var _v1 = attr.b;
		var _v2 = _v1.a;
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var $mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $mdgriffith$elm_ui$Element$Input$onKey = F2(
	function (desiredCode, msg) {
		var decode = function (code) {
			return _Utils_eq(code, desiredCode) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('Not the enter key');
		};
		var isKey = A2(
			$elm$json$Json$Decode$andThen,
			decode,
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
		return $mdgriffith$elm_ui$Internal$Model$Attr(
			A2(
				$elm$html$Html$Events$preventDefaultOn,
				'keyup',
				A2(
					$elm$json$Json$Decode$map,
					function (fired) {
						return _Utils_Tuple2(fired, true);
					},
					isKey)));
	});
var $mdgriffith$elm_ui$Element$Input$onEnter = function (msg) {
	return A2($mdgriffith$elm_ui$Element$Input$onKey, $mdgriffith$elm_ui$Element$Input$enter, msg);
};
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.cursorPointer);
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _v0) {
		var onPress = _v0.onPress;
		var label = _v0.label;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.contentCenterX + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.contentCenterY + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.seButton + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.noTextSelection)))))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$pointer,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											$elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 'Nothing') {
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$Attr(
														$elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														$elm$core$List$cons,
														$mdgriffith$elm_ui$Element$Input$onEnter(msg),
														attrs));
											}
										}()))))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $author$project$Main$flatButton = F2(
	function (onPress, content) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$padding(10)
				]),
			{label: content, onPress: onPress});
	});
var $yotamDvir$elm_pivot$Pivot$Get$hasR = function (_v0) {
	var _v1 = _v0.b;
	var r = _v1.b;
	return !$elm$core$List$isEmpty(r);
};
var $yotamDvir$elm_pivot$Pivot$hasR = $yotamDvir$elm_pivot$Pivot$Get$hasR;
var $author$project$Main$redo = function (p) {
	return $yotamDvir$elm_pivot$Pivot$hasR(p) ? A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Just($author$project$Main$Redo),
		A2($author$project$Main$icon, _List_Nil, $lattyware$elm_fontawesome$FontAwesome$Solid$arrowRight)) : A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Nothing,
		A2(
			$author$project$Main$icon,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					A3($mdgriffith$elm_ui$Element$rgb255, 150, 150, 150))
				]),
			$lattyware$elm_fontawesome$FontAwesome$Solid$arrowRight));
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$broom = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'broom', 640, 512, 'M256.47 216.77l86.73 109.18s-16.6 102.36-76.57 150.12C206.66 523.85 0 510.19 0 510.19s3.8-23.14 11-55.43l94.62-112.17c3.97-4.7-.87-11.62-6.65-9.5l-60.4 22.09c14.44-41.66 32.72-80.04 54.6-97.47 59.97-47.76 163.3-40.94 163.3-40.94zM636.53 31.03l-19.86-25c-5.49-6.9-15.52-8.05-22.41-2.56l-232.48 177.8-34.14-42.97c-5.09-6.41-15.14-5.21-18.59 2.21l-25.33 54.55 86.73 109.18 58.8-12.45c8-1.69 11.42-11.2 6.34-17.6l-34.09-42.92 232.48-177.8c6.89-5.48 8.04-15.53 2.55-22.44z');
var $author$project$Main$emptyPosition = {moveNumber: 0, pieces: _List_Nil};
var $author$project$Main$resetClearBoard = function (p) {
	return (!_Utils_eq(
		$yotamDvir$elm_pivot$Pivot$getC(p),
		$author$project$Main$emptyPosition)) ? A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Just(
			$author$project$Main$Reset($author$project$Main$emptyPosition)),
		A2($author$project$Main$icon, _List_Nil, $lattyware$elm_fontawesome$FontAwesome$Solid$broom)) : A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Nothing,
		A2(
			$author$project$Main$icon,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					A3($mdgriffith$elm_ui$Element$rgb255, 150, 150, 150))
				]),
			$lattyware$elm_fontawesome$FontAwesome$Solid$broom));
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$home = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'home', 576, 512, 'M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z');
var $author$project$Main$resetStartingBoard = function (p) {
	return (!_Utils_eq(
		$yotamDvir$elm_pivot$Pivot$getC(p),
		$author$project$Main$initialPosition)) ? A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Just(
			$author$project$Main$Reset($author$project$Main$initialPosition)),
		A2($author$project$Main$icon, _List_Nil, $lattyware$elm_fontawesome$FontAwesome$Solid$home)) : A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Nothing,
		A2(
			$author$project$Main$icon,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					A3($mdgriffith$elm_ui$Element$rgb255, 150, 150, 150))
				]),
			$lattyware$elm_fontawesome$FontAwesome$Solid$home));
};
var $author$project$Main$Undo = {$: 'Undo'};
var $lattyware$elm_fontawesome$FontAwesome$Solid$arrowLeft = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'arrow-left', 448, 512, 'M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z');
var $yotamDvir$elm_pivot$Pivot$Get$hasL = function (_v0) {
	var _v1 = _v0.b;
	var l = _v1.a;
	return !$elm$core$List$isEmpty(l);
};
var $yotamDvir$elm_pivot$Pivot$hasL = $yotamDvir$elm_pivot$Pivot$Get$hasL;
var $author$project$Main$undo = function (p) {
	return $yotamDvir$elm_pivot$Pivot$hasL(p) ? A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Just($author$project$Main$Undo),
		A2($author$project$Main$icon, _List_Nil, $lattyware$elm_fontawesome$FontAwesome$Solid$arrowLeft)) : A2(
		$author$project$Main$flatButton,
		$elm$core$Maybe$Nothing,
		A2(
			$author$project$Main$icon,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					A3($mdgriffith$elm_ui$Element$rgb255, 150, 150, 150))
				]),
			$lattyware$elm_fontawesome$FontAwesome$Solid$arrowLeft));
};
var $author$project$Main$sidebarActionButtons = function (p) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				$author$project$Main$undo(p),
				$author$project$Main$redo(p),
				$author$project$Main$resetStartingBoard(p),
				$author$project$Main$resetClearBoard(p)
			]));
};
var $author$project$Main$CreateTool = {$: 'CreateTool'};
var $author$project$Main$DeleteTool = {$: 'DeleteTool'};
var $author$project$Main$DeleteToolFilter = function (a) {
	return {$: 'DeleteToolFilter', a: a};
};
var $author$project$Main$MoveToolFilter = function (a) {
	return {$: 'MoveToolFilter', a: a};
};
var $author$project$Main$backgroundFocus = function (isFocused) {
	return isFocused ? $mdgriffith$elm_ui$Element$Background$color(
		A3($mdgriffith$elm_ui$Element$rgb255, 200, 200, 200)) : $mdgriffith$elm_ui$Element$Background$color(
		A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255));
};
var $author$project$Main$toolConfigOption = F4(
	function (currentValue, msg, buttonValue, caption) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Events$onClick(
					msg(buttonValue)),
					$author$project$Main$backgroundFocus(
					_Utils_eq(currentValue, buttonValue)),
					$mdgriffith$elm_ui$Element$padding(5)
				]),
			$mdgriffith$elm_ui$Element$text(caption));
	});
var $author$project$Main$colorConfig = F2(
	function (currentColor, msg) {
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					A4($author$project$Main$toolConfigOption, currentColor, msg, $elm$core$Maybe$Nothing, 'all pieces'),
					A4(
					$author$project$Main$toolConfigOption,
					currentColor,
					msg,
					$elm$core$Maybe$Just($author$project$Sako$White),
					'white pieces'),
					A4(
					$author$project$Main$toolConfigOption,
					currentColor,
					msg,
					$elm$core$Maybe$Just($author$project$Sako$Black),
					'black pieces')
				]));
	});
var $author$project$Main$ToolSelect = function (a) {
	return {$: 'ToolSelect', a: a};
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$chess = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'chess', 512, 512, 'M74 208H64a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h15.94A535.78 535.78 0 0 1 64 384h128a535.78 535.78 0 0 1-15.94-128H192a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-10l33.89-90.38a16 16 0 0 0-15-21.62H144V64h24a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8h-24V8a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v24H88a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24v32H55.09a16 16 0 0 0-15 21.62zm173.16 251.58L224 448v-16a16 16 0 0 0-16-16H48a16 16 0 0 0-16 16v16L8.85 459.58A16 16 0 0 0 0 473.89V496a16 16 0 0 0 16 16h224a16 16 0 0 0 16-16v-22.11a16 16 0 0 0-8.84-14.31zm92.77-157.78l-3.29 82.2h126.72l-3.29-82.21 24.6-20.79A32 32 0 0 0 496 256.54V198a6 6 0 0 0-6-6h-26.38a6 6 0 0 0-6 6v26h-24.71v-26a6 6 0 0 0-6-6H373.1a6 6 0 0 0-6 6v26h-24.71v-26a6 6 0 0 0-6-6H310a6 6 0 0 0-6 6v58.6a32 32 0 0 0 11.36 24.4zM384 304a16 16 0 0 1 32 0v32h-32zm119.16 155.58L480 448v-16a16 16 0 0 0-16-16H336a16 16 0 0 0-16 16v16l-23.15 11.58a16 16 0 0 0-8.85 14.31V496a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-22.11a16 16 0 0 0-8.84-14.31z');
var $mdgriffith$elm_ui$Element$fillPortion = $mdgriffith$elm_ui$Internal$Model$Fill;
var $author$project$Main$createToolButton = function (tool) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$fillPortion(1)),
				$mdgriffith$elm_ui$Element$spacing(5),
				$mdgriffith$elm_ui$Element$padding(5),
				$mdgriffith$elm_ui$Element$Border$color(
				A3($mdgriffith$elm_ui$Element$rgb255, 0, 0, 0)),
				$mdgriffith$elm_ui$Element$Border$width(1),
				$author$project$Main$backgroundFocus(
				_Utils_eq(tool, $author$project$Main$CreateTool)),
				$mdgriffith$elm_ui$Element$Events$onClick(
				$author$project$Main$ToolSelect($author$project$Main$CreateTool))
			]),
		_List_fromArray(
			[
				A2($author$project$Main$icon, _List_Nil, $lattyware$elm_fontawesome$FontAwesome$Solid$chess),
				$mdgriffith$elm_ui$Element$text('Add Piece')
			]));
};
var $author$project$Main$CreateToolColor = function (a) {
	return {$: 'CreateToolColor', a: a};
};
var $author$project$Main$CreateToolType = function (a) {
	return {$: 'CreateToolType', a: a};
};
var $author$project$Main$createToolConfig = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_List_Nil,
				_List_fromArray(
					[
						A4($author$project$Main$toolConfigOption, model.createToolColor, $author$project$Main$CreateToolColor, $author$project$Sako$White, 'White'),
						A4($author$project$Main$toolConfigOption, model.createToolColor, $author$project$Main$CreateToolColor, $author$project$Sako$Black, 'Black')
					])),
				A2(
				$mdgriffith$elm_ui$Element$wrappedRow,
				_List_Nil,
				_List_fromArray(
					[
						A4($author$project$Main$toolConfigOption, model.createToolType, $author$project$Main$CreateToolType, $author$project$Sako$Pawn, 'Pawn'),
						A4($author$project$Main$toolConfigOption, model.createToolType, $author$project$Main$CreateToolType, $author$project$Sako$Rock, 'Rock'),
						A4($author$project$Main$toolConfigOption, model.createToolType, $author$project$Main$CreateToolType, $author$project$Sako$Knight, 'Knight'),
						A4($author$project$Main$toolConfigOption, model.createToolType, $author$project$Main$CreateToolType, $author$project$Sako$Bishop, 'Bishop'),
						A4($author$project$Main$toolConfigOption, model.createToolType, $author$project$Main$CreateToolType, $author$project$Sako$Queen, 'Queen'),
						A4($author$project$Main$toolConfigOption, model.createToolType, $author$project$Main$CreateToolType, $author$project$Sako$King, 'King')
					]))
			]));
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$trash = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'trash', 448, 512, 'M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z');
var $author$project$Main$deleteToolButton = function (tool) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$fillPortion(1)),
				$mdgriffith$elm_ui$Element$spacing(5),
				$mdgriffith$elm_ui$Element$padding(5),
				$mdgriffith$elm_ui$Element$Border$color(
				A3($mdgriffith$elm_ui$Element$rgb255, 0, 0, 0)),
				$mdgriffith$elm_ui$Element$Border$width(1),
				$author$project$Main$backgroundFocus(
				_Utils_eq(tool, $author$project$Main$DeleteTool)),
				$mdgriffith$elm_ui$Element$Events$onClick(
				$author$project$Main$ToolSelect($author$project$Main$DeleteTool))
			]),
		_List_fromArray(
			[
				A2($author$project$Main$icon, _List_Nil, $lattyware$elm_fontawesome$FontAwesome$Solid$trash),
				$mdgriffith$elm_ui$Element$text('Delete Piece')
			]));
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$arrowsAlt = A5($lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'arrows-alt', 512, 512, 'M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z');
var $author$project$Main$moveToolButton = function (tool) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$fillPortion(1)),
				$mdgriffith$elm_ui$Element$spacing(5),
				$mdgriffith$elm_ui$Element$padding(5),
				$mdgriffith$elm_ui$Element$Border$color(
				A3($mdgriffith$elm_ui$Element$rgb255, 0, 0, 0)),
				$mdgriffith$elm_ui$Element$Border$width(1),
				$author$project$Main$backgroundFocus(
				_Utils_eq(tool, $author$project$Main$MoveTool)),
				$mdgriffith$elm_ui$Element$Events$onClick(
				$author$project$Main$ToolSelect($author$project$Main$MoveTool))
			]),
		_List_fromArray(
			[
				A2($author$project$Main$icon, _List_Nil, $lattyware$elm_fontawesome$FontAwesome$Solid$arrowsAlt),
				$mdgriffith$elm_ui$Element$text('Move Piece')
			]));
};
var $author$project$Main$toolConfig = function (editor) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				$author$project$Main$moveToolButton(editor.tool),
				_Utils_eq(editor.tool, $author$project$Main$MoveTool) ? A2($author$project$Main$colorConfig, editor.moveToolColor, $author$project$Main$MoveToolFilter) : $mdgriffith$elm_ui$Element$none,
				$author$project$Main$deleteToolButton(editor.tool),
				_Utils_eq(editor.tool, $author$project$Main$DeleteTool) ? A2($author$project$Main$colorConfig, editor.deleteToolColor, $author$project$Main$DeleteToolFilter) : $mdgriffith$elm_ui$Element$none,
				$author$project$Main$createToolButton(editor.tool),
				_Utils_eq(editor.tool, $author$project$Main$CreateTool) ? $author$project$Main$createToolConfig(editor) : $mdgriffith$elm_ui$Element$none
			]));
};
var $author$project$Main$SetViewMode = function (a) {
	return {$: 'SetViewMode', a: a};
};
var $author$project$Main$viewModeConfig = function (editor) {
	return A2(
		$mdgriffith$elm_ui$Element$wrappedRow,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(5)
			]),
		_List_fromArray(
			[
				A4(
				$author$project$Main$toolConfigOption,
				editor.viewMode,
				A2($elm$core$Basics$composeR, $author$project$Main$SetViewMode, $author$project$Main$EditorMsgWrapper),
				$author$project$Main$ShowNumbers,
				'Show numbers'),
				A4(
				$author$project$Main$toolConfigOption,
				editor.viewMode,
				A2($elm$core$Basics$composeR, $author$project$Main$SetViewMode, $author$project$Main$EditorMsgWrapper),
				$author$project$Main$CleanBoard,
				'Hide numbers')
			]));
};
var $author$project$Main$sidebar = F2(
	function (taco, model) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, 400, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$spacing(10),
					$mdgriffith$elm_ui$Element$padding(10),
					$mdgriffith$elm_ui$Element$alignRight
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$map,
					$author$project$Main$EditorMsgWrapper,
					$author$project$Main$sidebarActionButtons(model.game)),
					A2(
					$mdgriffith$elm_ui$Element$map,
					$author$project$Main$EditorMsgWrapper,
					$author$project$Main$toolConfig(model)),
					$author$project$Main$colorSchemeConfig(taco),
					$author$project$Main$viewModeConfig(model),
					A2(
					$mdgriffith$elm_ui$Element$map,
					$author$project$Main$EditorMsgWrapper,
					A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Events$onClick($author$project$Main$DownloadSvg)
							]),
						$mdgriffith$elm_ui$Element$text('Download as Svg'))),
					A2(
					$mdgriffith$elm_ui$Element$map,
					$author$project$Main$EditorMsgWrapper,
					A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Events$onClick($author$project$Main$DownloadPng)
							]),
						$mdgriffith$elm_ui$Element$text('Download as Png'))),
					A2(
					$mdgriffith$elm_ui$Element$map,
					$author$project$Main$EditorMsgWrapper,
					A2($author$project$Main$markdownCopyPaste, taco, model))
				]));
	});
var $author$project$Main$editorUi = F2(
	function (taco, model) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					$author$project$Main$pageHeader($author$project$Main$EditorPage),
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$html($lattyware$elm_fontawesome$FontAwesome$Styles$css),
							A2(
							$mdgriffith$elm_ui$Element$map,
							$author$project$Main$EditorMsgWrapper,
							A4(
								$author$project$Main$positionView,
								taco,
								model,
								$yotamDvir$elm_pivot$Pivot$getC(model.game),
								model.drag)),
							A2($author$project$Main$sidebar, taco, model)
						]))
				]));
	});
var $author$project$Main$examplesList = F2(
	function (taco, model) {
		var _v0 = model.exampleFile;
		switch (_v0.$) {
			case 'NotAsked':
				return $mdgriffith$elm_ui$Element$none;
			case 'Loading':
				return $mdgriffith$elm_ui$Element$text('Loading examples');
			case 'Failure':
				return $mdgriffith$elm_ui$Element$text('Error while loading examples.');
			default:
				var examplePositions = _v0.a;
				var positionPreviews = A2(
					$elm$core$List$map,
					$author$project$Main$loadPositionPreview(taco),
					examplePositions);
				var rows = A2($elm_community$list_extra$List$Extra$greedyGroupsOf, 5, positionPreviews);
				return A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(5)
						]),
					A2(
						$elm$core$List$map,
						function (group) {
							return A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$spacing(5)
									]),
								group);
						},
						rows));
		}
	});
var $author$project$Main$libraryUi = F2(
	function (taco, model) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(5),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					$author$project$Main$pageHeader($author$project$Main$LibraryPage),
					$mdgriffith$elm_ui$Element$text('Choose an initial board position to open the editor.'),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(24)
						]),
					$mdgriffith$elm_ui$Element$text('Start new')),
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(5)
						]),
					_List_fromArray(
						[
							A2($author$project$Main$loadPositionPreview, taco, $author$project$Main$emptyPosition),
							A2($author$project$Main$loadPositionPreview, taco, $author$project$Main$initialPosition)
						])),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(24)
						]),
					$mdgriffith$elm_ui$Element$text('Load saved position')),
					$mdgriffith$elm_ui$Element$text('Sorry, but saving positions is not supported yet.'),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(24)
						]),
					$mdgriffith$elm_ui$Element$text('Load examples')),
					A2($author$project$Main$examplesList, taco, model)
				]));
	});
var $author$project$StaticText$mainPageGreetingText = '# A tool collection for Paco Ŝako\n\nI am working on various tool to help us communicate about Paco Ŝako. Currently there is a "Position Editor" which you can use to create Paco Ŝako positions and generate images. You can download the images as a PNG if you want to share it. There is also a SVG export available, if you want to change the image in any way.\n\n```\n.. .K .. .. .. .. BP ..\nPN .. N. .. PP .. .. ..\n.P .. RP .. .. NQ .. ..\n.. .. .B BR P. QN PB ..\nRP K. P. .. .P .. .. ..\nP. P. .. .. .. .P .. ..\n.. .. .P .. .. .. .. ..\n.. .. .. .. .. .. PR ..\n```\n\nIf you want some more examples, check out the *Library* page!\n\nWe don\'t have any user profiles yet, this means you can not save any positions you create with this tool. Right now, there is only a text export that you need to save to a file.\n\n\n## Writing about Paco Ŝako\n\nThe tool collection now also includes a simple text editor that you can use to write texts on Paco Ŝako. The nice thing abouth this editor is, that you can directly embed positions from the editor into the text.';
var $author$project$Main$greetingText = function (taco) {
	var _v0 = A2($author$project$Main$markdownView, taco, $author$project$StaticText$mainPageGreetingText);
	if (_v0.$ === 'Ok') {
		var rendered = _v0.a;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(30),
					$mdgriffith$elm_ui$Element$padding(80),
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, 1000, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$centerX
				]),
			rendered);
	} else {
		var errors = _v0.a;
		return $mdgriffith$elm_ui$Element$text(errors);
	}
};
var $author$project$Main$mainPageUi = function (taco) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				$author$project$Main$pageHeader($author$project$Main$MainPage),
				$author$project$Main$greetingText(taco)
			]));
};
var $author$project$Main$globalUi = function (model) {
	var _v0 = model.page;
	switch (_v0.$) {
		case 'MainPage':
			return $author$project$Main$mainPageUi(model.taco);
		case 'EditorPage':
			return A2($author$project$Main$editorUi, model.taco, model.editor);
		case 'LibraryPage':
			return A2($author$project$Main$libraryUi, model.taco, model);
		default:
			return A2($author$project$Main$blogUi, model.taco, model.blog);
	}
};
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 'OnlyDynamic', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 'StaticRootAndDynamic', a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = {$: 'AllowHover'};
var $mdgriffith$elm_ui$Internal$Model$Layout = {$: 'Layout'};
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	backgroundColor: $elm$core$Maybe$Nothing,
	borderColor: $elm$core$Maybe$Nothing,
	shadow: $elm$core$Maybe$Just(
		{
			blur: 0,
			color: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			offset: _Utils_Tuple2(0, 0),
			size: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 'HoverOption':
					var hoverable = opt.a;
					var _v4 = record.hover;
					if (_v4.$ === 'Nothing') {
						return _Utils_update(
							record,
							{
								hover: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 'FocusStyleOption':
					var focusStyle = opt.a;
					var _v5 = record.focus;
					if (_v5.$ === 'Nothing') {
						return _Utils_update(
							record,
							{
								focus: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.mode;
					if (_v6.$ === 'Nothing') {
						return _Utils_update(
							record,
							{
								mode: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			focus: function () {
				var _v0 = record.focus;
				if (_v0.$ === 'Nothing') {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			hover: function () {
				var _v1 = record.hover;
				if (_v1.$ === 'Nothing') {
					return $mdgriffith$elm_ui$Internal$Model$AllowHover;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			mode: function () {
				var _v2 = record.mode;
				if (_v2.$ === 'Nothing') {
					return $mdgriffith$elm_ui$Internal$Model$Layout;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{focus: $elm$core$Maybe$Nothing, hover: $elm$core$Maybe$Nothing, mode: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 'Unstyled':
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 'Styled':
				var styles = el.a.styles;
				var html = el.a.html;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 'Text':
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.mode;
			if (_v0.$ === 'NoStaticStyleSheet') {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 'SansSerif'};
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.options;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.root, $mdgriffith$elm_ui$Internal$Style$classes.any, $mdgriffith$elm_ui$Internal$Style$classes.single]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $mdgriffith$elm_ui$Element$layout = $mdgriffith$elm_ui$Element$layoutWith(
	{options: _List_Nil});
var $author$project$Main$view = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$layout,
		_List_Nil,
		$author$project$Main$globalUi(model));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));