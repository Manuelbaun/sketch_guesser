import { WebGroup, WebGroupState } from 'netflux';

interface NetFluxTestOptions {
	name: string;
	groupId: string;
}

export default class NetfluxTest {
	wg: WebGroup;
	onDataReceived: Function;
	constructor(options: NetFluxTestOptions) {
		// Create instance and set callbacks
		this.wg = new WebGroup({
			signalingServer: 'ws://192.168.178.149:8010',
			autoRejoin: true
		});

		this.wg.onMemberJoin = (id) => {
			console.log(`Member ${id} has joined. Current members list is: `, this.wg.members);
			// Say hello to the new peer
			this.wg.sendTo(id, 'Hello, my name is ' + options.name);
		};

		this.wg.onMemberLeave = (id) => {
			console.log(`Member ${id} has left. Remained members are: `, this.wg.members);
		};

		this.wg.onMyId = (id) => console.log('On my ID called');

		this.wg.onMessage = (id, data) => {
			// console.log(`Message from ${id} group member`, data);
			this.onDataReceived(data);
		};

		this.wg.onStateChange = (state) => {
			console.log('The new Group state is ', state);
			switch (state) {
				case WebGroupState.JOINING:
					// Do something
					break;
				case WebGroupState.JOINED:
					// Do something... for example invite a bot...
					// this.wg.invite('BOT_SERVER_WEB_SOCKET_URL');
					// Or send message to all peers
					this.wg.send(`Hello everybody. I "${options.name}" have just joined the group.`);
					this.onJoined();
					break;
				case WebGroupState.LEFT:
					// this.wg.key === ''
					// this.wg.id === 0
					// this.wg.myId === 0
					// this.wg.members === []
					// the current this.wg object is at the same state as if it was instantiated via new WebGroup(...), hence
					// it can be reused to join another group for example.
					// Do something...
					break;
			}
		};

		//  Join the group
		this.wg.join(options.groupId);
	}

	onJoined = () => {};
	leave() {
		this.wg.leave();
	}

	send(data: string | Uint8Array) {
		this.wg.send(data);
	}
}
