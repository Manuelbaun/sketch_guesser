import Chance from 'chance';
import * as random from 'lib0/random.js';

export class RandomGenerator {
	static _chance = Chance();
	static float({ min, max }) {
		return this._chance.floating({ min, max });
	}

	static avatarName() {
		return this._chance.name();
	}

	static uuidv4() {
		return random.uuidv4();
	}
	static uint32() {
		return random.uint32();
	}
}
