const Kontract = require('./Kontract.js');
const Kontractor = require('./Kontractor.js');

const storage = new WeakMap();

/**
 * Determine whether the provided target can be constructed
 *
 * @param {*} target
 * @returns boolean constructor
 */
function isConstructor(target) {
	return Boolean(target && target.prototype && target.prototype.constructor);
}

/**
 * Set or retrieve weak references, returns the key instead of the value when setting
 *
 * @param {object} key
 * @param {*} value
 * @returns {*} value/key
 */
function reference(key, ...args) {
	return args.length ? (storage.set(key, ...args), key) : storage.get(key);
}

/**
 * Obtain the registered Kontracts associated with each extender
 *
 * @param {*} ext
 * @returns
 */
function registered(...ext) {
	return ext.reduce(
		(carry, ex) => carry.concat(reference(ex)).filter(Boolean),
		[]
	);
}

/**
 * Register a kontract (extender) function
 *
 * @param {function} extend
 * @returns {function} factory
 */
function register(...ext) {
	const kontract = new Kontract();
	const factory = ext.reduce(
		(fn, ex) => (C) => fn(ex(C)),
		(C) =>
			class Kontracted extends C {
				get [kontract]() {
					return kontract;
				}
				static get [kontract]() {
					return kontract;
				}
			}
	);

	reference(factory, [kontract].concat(registered(...ext)));

	return factory;
}

/**
 * Determine whether the given target extends all provided extenders
 *
 * @param {class|object} target
 * @param {...function} extenders
 * @returns {boolean} has
 */
function has(target, ...ext) {
	return target
		? ext
				.filter((ex) => ex instanceof Function)
				.reduce(
					(verdict, ex) =>
						verdict &&
						registered(ex).filter(
							(kontract) => target[kontract] !== kontract
						).length <= 0,
					true
				)
		: false;
}

/**
 * Compose a class from the provided mixer functions
 *
 * @param {...function} extenders
 * @returns {class} composed
 * @note the first argument may be a class, in which case it will be used as
 *       base class instead of the default Kontractor
 */
function compose(...ext) {
	const base = isConstructor(ext[0]) ? ext.shift() : Kontractor;
	const factory = ext
		.filter((extend) => extend instanceof Function)
		.filter((extend, index, all) => all.indexOf(extend) === index)
		.reduce((carry, extend) => {
			const intermediate = extend(carry);

			if (!isConstructor(intermediate)) {
				throw new Error(`Return value is not a constructor: ${extend}`);
			}

			return reference(intermediate, extend);
		}, base);

	reference(factory, registered(ext));

	return factory;
}

module.exports = { register, compose, has };
