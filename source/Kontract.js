const storage = new WeakMap();

/**
 * Kontract class, usable as unique key
 *
 * @class Kontract
 */
class Kontract {
	constructor() {
		const {
			constructor: { unique }
		} = this;

		storage.set(this, { unique });
	}

	toString() {
		const { unique } = storage.get(this);

		return `Kontract/${unique}`;
	}

	static get unique() {
		storage.set(this, (storage.get(this) || Date.now()) + 1);

		return storage.get(this);
	}
}

module.exports = Kontract;
