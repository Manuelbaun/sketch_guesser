// import { Map as YMap } from 'yjs';
// import { Observable } from 'lib0/observable';

export interface IStoreAdapter<Keys> {
	set(key: Keys, value: any): void;
	setMulti(arg0: Array<{ key: Keys; value: any }>): void;
	get(key: Keys): any;
	dispose();
}

// Test

// class AbstractAdapter<Keys, Events> extends Observable<Events> implements StoreAdapter<Keys> {
// 	map;
// 	dispose() {
// 		console.log('Dispose');
// 	}

// 	set(key: Keys, value: any) {
// 		console.log('Set Key');
// 	}

// 	setMulti(arg0: Array<{ key: Keys; value: any }>) {
// 		// TODO,wrapp with batch action
// 		arg0.forEach((data) => console.log(data));
// 	}

// 	get(key: Keys): any {
// 		return 'any';
// 	}
// }

// enum StoreKeys {
// 	TWO,
// 	ONE
// }

// class GameStore extends AbstractAdapter<StoreKeys> {
// 	map = new YMap();
// 	constructor() {
// 		super();
// 		this.set(StoreKeys.ONE, 0);
// 	}
// }
