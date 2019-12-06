import * as Y from 'yjs';

/**
 * Remote doc updated form local doc works 
 */
function play() {
	// create yDocs
	const local = new Y.Doc();
	const remote = new Y.Doc();

	// setup on Update listener
	local.on('update', (update) => {
		console.log('local update => apply to remote');
		Y.applyUpdate(remote, update);
	});

	remote.on('update', (update) => {
		console.log('remote update from local', remote);
		const remoteMap = remote.getMap('map');
		console.log(remoteMap.get('key1'));
	});

	// creates array and maps
	const remoteArr = remote.getArray('arr');
	const remoteMap = remote.getMap('map');

	const localArr = local.getArray('arr');
	const localMap = local.getMap('map');

	// apply changes to the maps and array
	// remoteMap.set('key1', 1234);

	localArr.push([ '12345' ]);
	localMap.set('key1', 123);
}

/**
 * Remote doc updated form local doc does not work, 
 * when map is set in the class, for example:
 * this.map.set("time", 60);
 */

function runPlayground() {
	let local: Test;
	let remote: Test;

	// Setup the test classes
	local = new Test({
		yDoc: new Y.Doc(),
		name: 'local',
		emitChange: (data) => {
			remote.applyUpdate(data);
		}
	});

	remote = new Test({
		yDoc: new Y.Doc(),
		name: 'remote',
		emitChange: (data) => {
			local.applyUpdate(data);
		}
	});

	// Add data to be synced
	const msg = {
		user: 'Bro',
		message: 'Hallo'
	};
	console.log('Add Object to local doc', msg);
	local.add(msg);
	local.set('time', 123);

	local.setObject({
		gameID: 123,
		name: 'jo',
		ts: Date.now()
	});

	local.setObject({
		// gameID: 123,
		name: 'Hans'
		// ts: Date.now()
	});
	// local.add(msg);
	// local.add(msg);
}

class Test {
	name: string;
	yDoc;
	map;
	arr;

	constructor({ yDoc, name, emitChange }) {
		this.name = name;
		this.yDoc = yDoc;
		this.map = this.yDoc.getMap('map');
		this.arr = this.yDoc.getArray('arr');

		// this.map.set("breakUpdate", true);
		this.yDoc.on('update', (update, origin) => {
			console.log(`${this.name} Map:`, this.map.entries());
			for (const entry of this.map.entries()) {
				console.log(entry);
			}
			console.log(`${this.name} Array:`, this.yDoc.getArray('arr').length);
			console.log(`==> ${this.name} emit Update`);
			emitChange(update);
		});
	}

	setObject(game) {
		this.yDoc.transact(() => {
			for (const key in game) {
				console.log(key, game[key]);
				this.map.set(key, game[key]);
			}
		});
	}

	set(key: string, value: any) {
		console.log(this.name, 'Set map with', key, value);
		this.map.set(key, value);
	}

	add(msg: Object) {
		this.yDoc.getArray('arr').push([ msg ]);
	}

	applyUpdate(update) {
		console.log(this.name, 'apply Update');
		Y.applyUpdate(this.yDoc, update);
	}
}

function example3() {
	const yDoc = new Y.Doc();
	yDoc.on('update', (update) => {
		console.log('received update', update);
	});

	yDoc.on('afterTransaction', (trans, doc) => {
		console.log('afterTransaction', trans);
	});

	const store = {
		game: yDoc.getArray('game'),
		players: yDoc.getArray('players')
	};

	// store.game.set('rounds', 3);

	const doc1 = new Y.Doc();
	const doc2 = new Y.Doc();

	doc1.on('update', (update) => {
		Y.applyUpdate(doc2, update);
	});

	doc2.on('update', (update) => {
		Y.applyUpdate(doc1, update);
	});

	doc1.getMap('game').set('time', 10);
	// All changes are also applied to the other document
	doc1.getArray('myarray').push([ 'Hello doc2, you got this?' ]);

	console.log(doc2.getArray('myarray').get(0));
	console.log(doc1.getMap('game').get('time'));
}

// play();
// example3();
runPlayground();
