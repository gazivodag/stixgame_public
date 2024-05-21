const { Server } = require("socket.io");

class SocketManager {
    server; //express server instance
    io; //socket io instance
    gameManager; //game manager instance

    constructor(server, gameManager)
    {
        this.server = server;
        this.gameManager = gameManager;
        this.io = new Server(this.server);
        this.registerListeners();
    }

    registerListeners()
    {
        this.io.on('connection', (socket) => {
            console.log('a user connected ', socket.id);
            // socket.join(socket.id);

            socket.on('disconnect', () => {
                console.log("a user disconnected");
                var player = this.gameManager.players[socket.id];

                if (player)
                {
                    socket.broadcast.emit('playerDisconnect', player.getName())
                    this.gameManager.disconnectPlayer(socket.id);
                }
            });

            socket.on('loginGame', (userName) => {
                var response = this.gameManager.loginPlayer(socket.id, userName);
                if (response.code === 1)
                    socket.join("world");
                console.log(response)

                socket.emit('loginGame', response);

            });

            socket.on('playerDestination', loc => {
                console.log("[server] i received a destination");
                console.log(loc)
                var player = this.gameManager.players[socket.id];
                if (player)
                    player.setDestination(loc);
                // this.gameManager.players[socket.id].destination = loc;
            });

        });
    }

}

module.exports = SocketManager;