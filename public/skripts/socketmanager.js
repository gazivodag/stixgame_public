class StixSocketManager {

    socket;
    eventBus;

    constructor(eventBus) {
        this.socket = io();
        this.eventBus = eventBus;
    }

    registerSockets()
    {
        //socket to eventBus
        this.socket.on('connect', () => this.eventBus.post('connect', this.socket.id));
        this.socket.on('loginGame', response => this.eventBus.post('loginGame', response));
        this.socket.on('playerDisconnect', playerName => this.eventBus.post('playerDisconnect', playerName))
        this.socket.on('gameCycle', gameCycleEvent => this.eventBus.post('gameCycle', gameCycleEvent))

        //eventBus to socket
        this.eventBus.on('emitLoginGame', userName => this.socket.emit('loginGame', userName));
        this.eventBus.on('emitPlayerDestination', location => this.socket.emit('playerDestination', location))
        this.eventBus.on('disconnect', () => this.socket.emit('disconnect', null));
    }




}