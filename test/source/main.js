/* global source, describe, each, it, expect */

const { register, compose, has } = source('main');

describe('Synthesize', () => {
	const One = register(
		(superclass) =>
			class One extends superclass {
				static get isOne() {
					return true;
				}

				get order() {
					return (super.order || []).concat('one');
				}
			}
	);
	const Two = register(
		(superclass) =>
			class extends superclass {
				static get isTwo() {
					return true;
				}

				get order() {
					return (super.order || []).concat('two');
				}
			}
	);
	const Three = register(
		(superclass) =>
			class extends superclass {
				static get isThree() {
					return true;
				}

				get order() {
					return (super.order || []).concat('three');
				}
			}
	);

	it('register', (next) => {
		expect(One).to.be.function();
		expect(Two).to.be.function();

		next();
	});

	describe('compose', () => {
		it('allows single compose', (next) => {
			const Single = compose(One);

			expect(Single).to.be.function();
			expect(Single.isOne).to.be.true();
			expect(Single.isTwo).to.be.undefined();

			const instance = new Single();

			expect(instance).to.be.object();
			expect(instance).to.be.instanceOf(Single);
			expect(instance.order).to.equal(['one']);

			next();
		});

		it('allows multiple compose (One, Two)', (next) => {
			const Multiple = compose(
				One,
				Two
			);

			expect(Multiple).to.be.function();
			expect(Multiple.isOne).to.be.true();
			expect(Multiple.isTwo).to.be.true();

			const instance = new Multiple();

			expect(instance).to.be.object();
			expect(instance).to.be.instanceOf(Multiple);
			expect(instance.order).to.equal(['one', 'two']);

			next();
		});

		it('allows multiple compose - inversed (Two, One)', (next) => {
			const Inversed = compose(
				Two,
				One
			);

			expect(Inversed).to.be.function();
			expect(Inversed.isOne).to.be.true();
			expect(Inversed.isTwo).to.be.true();

			const instance = new Inversed();

			expect(instance).to.be.object();
			expect(instance).to.be.instanceOf(Inversed);
			expect(instance.order).to.equal(['two', 'one']);

			next();
		});

		it('allows a combined registration', (next) => {
			const Combined = compose(
				One,
				Two
			);

			expect(has(Combined, One)).to.be.true();
			expect(has(Combined, Two)).to.be.true();
			expect(has(Combined, One, Two)).to.be.true();

			const combined = new Combined();

			expect(has(combined, One)).to.be.true();
			expect(has(combined, Two)).to.be.true();
			expect(has(combined, One, Two)).to.be.true();

			next();
		});

		it('uses a class to apply the following "registers" on', (next) => {
			class Foo {
				static get isFoo() {
					return true;
				}

				get order() {
					return ['foo'];
				}
			}

			const Rebase = compose(
				Foo,
				One,
				Two
			);

			expect(Rebase).to.be.function();
			expect(Rebase.isOne).to.be.true();
			expect(Rebase.isTwo).to.be.true();
			expect(Rebase.isFoo).to.be.true();

			const instance = new Rebase();

			expect(instance).to.be.object();
			expect(instance).to.be.instanceOf(Rebase);
			expect(instance.order).to.equal(['foo', 'one', 'two']);

			next();
		});

		it('does not trip on non functions to base "registers" on', (next) => {
			const values = [
				null,
				true,
				false,
				undefined,
				1,
				Math.PI,
				Infinity,
				'string',
				[]
			].map(compose);
			const [check] = values;

			values.forEach((compare) => {
				expect(check).to.equal(compare);
			});

			next();
		});

		it('does not implement the same Kontract multiple times', (next) => {
			const Repeat = compose(
				One,
				One,
				One,
				One
			);

			expect(Repeat).to.be.function();
			expect(Repeat.isOne).to.be.true();
			expect(Repeat.isTwo).to.be.undefined();

			const instance = new Repeat();

			expect(instance).to.be.object();
			expect(instance).to.be.instanceOf(Repeat);
			expect(instance.order).to.equal(['one']);

			next();
		});

		it('throws on non-class output', (next) => {
			expect(() =>
				compose(
					One,
					() => true
				)
			).to.throw(/^Return value is not a constructor/);

			next();
		});
	});

	describe('has', () => {
		class Synth extends compose(
			One,
			Two
		) {}
		const synth = new Synth();

		it('detects on class', (next) => {
			expect(has(Synth, One)).to.be.true();
			expect(has(Synth, Two)).to.be.true();
			expect(has(Synth, One, Two)).to.be.true();
			expect(has(Synth, Two, One)).to.be.true();

			expect(has(Synth, Three)).to.be.false();
			expect(has(Synth, One, Three)).to.be.false();
			expect(has(Synth, Two, Three)).to.be.false();
			expect(has(Synth, One, Two, Three)).to.be.false();
			expect(has(Synth, Three, Two, One)).to.be.false();

			next();
		});

		it('detects on instance', (next) => {
			expect(has(synth, One)).to.be.true();
			expect(has(synth, Two)).to.be.true();
			expect(has(synth, One, Two)).to.be.true();
			expect(has(synth, Two, One)).to.be.true();

			expect(has(synth, Three)).to.be.false();
			expect(has(synth, One, Three)).to.be.false();
			expect(has(synth, Two, Three)).to.be.false();
			expect(has(synth, One, Two, Three)).to.be.false();
			expect(has(synth, Three, Two, One)).to.be.false();

			next();
		});

		it('does not trip on null or undefined', (next) => {
			expect(has(null, One)).to.be.false();
			expect(has(undefined, Two)).to.be.false();

			next();
		});
	});
});
