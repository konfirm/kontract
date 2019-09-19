# Kontract

Register, verify and compose "contrats" (classes) to allow for contract checks with class compositions.

## Installation

As Kontract is a scoped package, the scope needs to be provided for both the installation and usage

```
$ npm install --save @konfirm/kontract
```

## Usage

The Kontract component exposes three functions; `register`, `compose` and `has`.

### `register(...extenders)`

Register a class extender as Kontract, this is a required step to be able to determine the implementation later on using `has`

```js
const { register } = require('@konfirm/kontract');

const Foo = register(
	(superclass) =>
		class extends superclass {
			get foo() {
				return 'I am foo';
			}
		}
);
const Bar = register(
	(superclass) =>
		class extends superclass {
			get bar() {
				return 'I am bar';
			}
		}
);
```

### `compose(...extenders)`

Compose a new class using class extender functions, if these are `register`ed before, they will be detectable. If the very first argument is a class (instead of an extender function) that class will be used as base class.

```js
const { compose } = require('@konfirm/kontract');

//  assuming Foo and Bar from the register example
const FooBar = compose(
	Foo,
	Bar
);
```

### `has(target, ...extenders)`

Has determines whether the provided target (which can be both a class or an instance) was extended by _all_ of the provided extenders.

```js
const { has } = require('@konfirm/kontract');

//  assuming Foo and Bar from the register example
//  assuming FooBar from the compose example
const foobar = new FooBar();

console.log(has(FooBar, Foo)); //  true
console.log(has(FooBar, Bar)); //  true
console.log(has(FooBar, Foo, Bar)); //  true

if (has(foobar, Foo)) {
	console.log(foobar.foo); //  'I am foo'
}
if (has(foobar, Bar)) {
	console.log(foobar.bar); //  'I am bar'
}
```

# License

MIT License Copyright (c) 2019 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
