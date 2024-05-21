const GameManagerHelper = require("./GameManagerHelper");
const Player = require("./Player");

class GameManager {
    map;
    players;
    gameClock;
    serverSpeed = 100;
    socketManager;
    gameManagerHelper;

    constructor() {
        this.players = {};
        this.map = [30, 30];
        this.startGameClock();
        this.gameManagerHelper = new GameManagerHelper(this);
    }

    setSocketManager(sm)
    {
        this.socketManager = sm;
    }

    async gameCycle() {
        if (!this.socketManager)
            return;
        
        // console.log("im a game cycle");
        var modifiedItems = {};

        //destination handling
        this.gameManagerHelper.handlePlayerDestinations();

        //finally, sending all the modified items as a game cycle
        var sockets = this.gameManagerHelper.getSocketArray();
        sockets.forEach(s => {
            modifiedItems["players"] = this.gameManagerHelper.getPlayersNearPlayer(s);
            this.socketManager.io.emit(s, modifiedItems);
        });
    }

    startGameClock() {
        this.gameClock = setInterval(() => this.gameCycle(), this.serverSpeed);
    }

    /*Login codes:
    -1 = General Error
    0 = Logged in already
    1 = Logged in
     */
    loginPlayer(socketId, playerName) {
        var objToReturn = {
            "code": -1
        }

        if (!playerName)
            return objToReturn;

        if (!this.isPlayerLoggedIn(playerName)) {
            objToReturn.code = 1;
            this.players[socketId] = new Player(playerName, { "x": 10.5, "y": 10.5 });
        } else {
            objToReturn.code = 0;
        }

        return objToReturn;
    }

    disconnectPlayer(socketId) {
        if (this.players[socketId])
            delete this.players[socketId]
    }

    isPlayerLoggedIn(playerName) {
        var keys = Object.keys(this.players);
        for (var i = 0; i < keys.length; i++) {
            var player = this.players[keys[i]];
            if (player.getName() === playerName)
                return true;
        }
        return false;
    }

    getOtherPlayers(socketId) {
        var keys = Object.keys(this.players);
        var arr = [];
        for (var i = 0; i < keys.length; i++) {
            if (socketId === keys[i])
                continue;

            var player = this.players[keys[i]];
            arr.push(player)
        }
        return arr;
    }

    getMapSize() {
        return this.map; //lol
    }
}

module.exports = GameManager;