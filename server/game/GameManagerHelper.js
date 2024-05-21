class GameManagerHelper {

    gameManager;

    playerDistance = 8.5;

    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    getPlayerContainer()
    {
        return this.gameManager.players;
    }

    getSocketArray()
    {
        return Object.keys(this.gameManager.players);
    }

    getPlayersNearPlayer(playerSocketId)
    {
        var playerContainer = this.getPlayerContainer();
        var ourInstance = playerContainer[playerSocketId];
        var sockets = this.getSocketArray();
        var playersInDistance = {};
        for (var i = 0 ; i < sockets.length ; i++)
        {   
            var socket = sockets[i];
            var theirInstance = playerContainer[socket];
            if (Math.abs(ourInstance.location.x - theirInstance.location.x) <= this.playerDistance && Math.abs(ourInstance.location.y - theirInstance.location.y) <= this.playerDistance - 3)
                playersInDistance[socket] = theirInstance;
        }
        return playersInDistance;
    }

    handlePlayerDestinations() {
        //destination handling
        var sockets = this.getSocketArray();
        for (var i = 0; i < sockets.length; i++) {
            var player = this.gameManager.players[sockets[i]];
            if (!player.destination)
                continue;


            //Math.floor(11 * 10) > Math.floor(10.3 * 10)
            if (Math.floor(player.location.x * 10) < Math.floor(player.destination.x * 10))
                player.location.x = Math.round((player.location.x + 0.1) * 100.0) / 100.0;
            else if (Math.floor(player.location.x * 10) > Math.floor(player.destination.x * 10))
                player.location.x = Math.round((player.location.x - 0.1) * 100.0) / 100.0;

            if (Math.floor(player.location.y * 10) < Math.floor(player.destination.y * 10))
                player.location.y = Math.round((player.location.y + 0.1) * 100.0) / 100.0;
            else if (Math.floor(player.location.y * 10) > Math.floor(player.destination.y * 10))
                player.location.y = Math.round((player.location.y - 0.1) * 100.0) / 100.0;

            if (player.location.x === player.destination.x && player.location.y === player.destination.y)
            player.destination = null;

            // console.log(player.destination)
            // console.log(player.location)
        }

    }
}

module.exports = GameManagerHelper;