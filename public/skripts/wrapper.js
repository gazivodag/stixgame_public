var eventBus;
var socketManager;
var client;

//currently not being used. currently, when each class is loaded in the html file, it is defining a class and creating an instance of itself.
window.onload((ol_e) => {

    eventBus = new GameEventBus();
    socketManager = new StixSocketManager(eventBus); //not coded, GameClient just talks to sockets directly
    client = new GameClient(eventBus, document, constants)

    eventBus.post('onload', ol_e);
});