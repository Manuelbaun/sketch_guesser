import Chance from 'chance';
import * as random from 'lib0/random.js';

export class RandomGenerator {
	static _chance = Chance();
	static float({ min, max }): number {
		return this._chance.floating({ min, max });
	}

	static avatarName(): string {
		return this._chance.name();
	}

	static uuidv4(): string {
		return random.uuidv4();
	}
	static uint32(): number {
		return random.uint32();
	}
}
