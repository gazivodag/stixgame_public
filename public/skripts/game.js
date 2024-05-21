class GameClient extends TileEngine {
    //player objects that we see
    player;
    players;

    //rendering variables
    canvas;
    ctx;
    gameWidth;
    gameHeight;
    moveOffset;

    //some things pulled from constants for easier access
    tileSize;
    playerSize;

    //render clock
    renderClock;
    renderSpeed;

    //listener handles
    rightClickHandle;

    constructor(eventBus, document) {
        super(eventBus, document);

        this.player = null;
        this.players = {};

        this.canvas = this.document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameWidth = 600; //soon to be changed to read from canvas directly
        this.gameHeight = 400; //soon to be changed to read from canvas directly
        this.moveOffset = {"x": 0, "y": 0}
        this.tileSize = StixConstants.dimensions.tileSize;
        this.playerSize = StixConstants.dimensions.playerSize;
        this.renderSpeed = 50;
    }


    /*====DRAWING STUFF====*/
    renderFrame()
    {
        this.drawWorld();
    }

    startRenderClock()
    {
        this.stopRenderClock();
        this.renderClock = setInterval(() => this.renderFrame(), this.renderSpeed);
    }

    stopRenderClock()
    {
        if (this.renderClock)
        {
            clearInterval(this.renderClock);
            this.renderClock = null;
        }
    }

    getTileInViewport(x, y) {
        var loc = this.player["location"];
        var minCoordX = Math.floor(loc["x"]) - Math.floor((this.gameWidth / 2) / tileSize);
        var maxCoordX = Math.floor(loc["x"]) - Math.floor((this.gameWidth / 2) / tileSize) + (this.gameWidth / tileSize);
        var minCoordY = Math.floor(loc["y"]) - Math.floor((this.gameHeight / 2) / tileSize);
        var maxCoordY = Math.floor(loc["y"]) - Math.floor((this.gameHeight / 2) / tileSize) + (this.gameHeight / tileSize);
        if (Math.floor(loc["x"]) > minCoordX && Math.floor(loc["x"]) < maxCoordX && Math.floor(loc["y"]) > minCoordY && Math.floor(loc["y"]) < maxCoordY)
            return { "localX": ((x - loc.x - 0.5) * tileSize) + (this.gameWidth / 2) - (tileSize / 2) + tileSize, "localY": ((y - loc.y - 0.5) * tileSize) + (this.gameHeight / 2) + tileSize }
        return null;
    }

    getCharacterTileRemainder(loc) {
        return {
            "x": ((loc.x * 100) - (Math.floor(loc.x) * 100)) * -1 * 0.01 * this.tileSize,
            "y": ((loc.y * 100) - (Math.floor(loc.y) * 100)) * -1 * 0.01 * this.tileSize
        }
    }

    drawWorld() {
        var loc = this.player["location"];
        var tR = this.getCharacterTileRemainder(loc);
        for (var x = 0; x <= Math.ceil(this.gameWidth / this.tileSize) + 2; x++) {
            for (var y = 0; y <= Math.ceil(this.gameHeight / this.tileSize) + 2; y++) {
                ctx.fillStyle = 'black';
                var coordX = Math.floor(loc["x"]) - Math.floor((this.gameWidth / 2) / this.tileSize) + x - 2;
                var coordY = Math.floor(loc["y"]) - Math.floor((this.gameHeight / 2) / this.tileSize) + y - 2;
                var tileToRender = getTile(coordX, coordY);

                var localX = this.tileSize * x - this.tileSize;
                var localY = this.tileSize * y - this.tileSize;
                ctx.drawImage(tileToRender,
                    localX + tR.x - (this.tileSize / 2) + this.moveOffset.x,
                    localY + tR.y - (this.tileSize / 2) + this.moveOffset.y,
                    this.tileSize, this.tileSize)
                //debug coords
                var str = `${coordX},${coordY}`;
                ctx.font = "8px Courier";
                ctx.strokeStyle = "black";
                ctx.strokeText(str,
                    localX + tR.x - (tileSize / 4) + moveOffset.x,
                    localY + tR.y + moveOffset.y);
            }
        }
    }
    /*====END OF DRAWING STUFF====*/

    /*====EVENTBUS STUFF (Getting character data, sending character data, anything that is being passed around)====*/
    registerEventBusListeners()
    {
        
    }

}



//player is outside for other scripts to read from


window.onload = async (ol_e) => {
    var player = null;

    console.log("working? im posting all of our other scripts first");
    eventBus.post('pageload', null)

    var canvas = document.getElementById('gameCanvas'),
        ctx = canvas.getContext('2d');

    // canvas.oncontextmenu = (e) => {
    //     console.log("context menu from canvas");
    //     e.preventDefault();
    //     e.stopPropagation();
    // }

    // var width = canvas.getAttribute("width");
    // var height = canvas.getAttribute("height");
    var width = 600
    var height = 400
    const tileSize = 40;
    const playerSize = { "x": 30, "y": 58 }

    var moveOffset = { "x": 0, "y": 0 }

    // ctx.fillStyle = 'green';
    // ctx.fillRect(10, 10, 150, 100);

    //resource map
    const resourceMap = {
        "player": document.getElementById('stickmanImg'),
        "grass": document.getElementById('grassImg'),
        "ooa": document.getElementById('ooaImg'),
    };

    //game world
    const gameMap = [25, 25]; //50*50 tiles
    function getTile(x, y) {
        if (x < 0 || y < 0 || x > gameMap[0] - 1 || y > gameMap[1] - 1)
            return resourceMap["ooa"];
        return resourceMap["grass"];
    }

    var players = {};

    function getLocalPlayer() {
        return player;
    }

    function drawDestination() {
        if (!player.destination)
            return;

        var tile = getTileInViewport(player.destination.x, player.destination.y);
        if (!tile)
            return;
        var tdX = 10,
            tdY = 10;
        ctx.fillStyle = 'red';
        ctx.fillRect(tile.localX - (tdX / 2) + moveOffset.x, tile.localY - (tdY / 2) + moveOffset.y, tdX, tdY);
    }


    const testDraws = [
        { "x": 10, "y": 10, "col": "yellow" },
        { "x": 10.5, "y": 10.5, "col": "red" },
        { "x": 11, "y": 11, "col": "white" },
    ];
    function testDraw() {
        for (var i = 0; i < testDraws.length; i++) {
            var draw = testDraws[i];
            var tile = getTileInViewport(draw.x, draw.y);
            if (tile == null)
                return;
            ctx.fillStyle = draw.col;
            ctx.fillRect(tile.localX + moveOffset.x, tile.localY + moveOffset.y, 10, 10)
        }
    }

    function drawCoordsTopLeft() {
        ctx.font = "12px Courier";
        ctx.strokeStyle = "yellow";
        ctx.strokeText(JSON.stringify(getLocalPlayer().location), 0, 14)
    }

    function drawOtherCharacters() {
        var otherPlayers = Object.values(players);
        for (var i = 0; i < otherPlayers.length; i++) {
            var otherPlayer = otherPlayers[i];
            var loc = otherPlayer.location;
            // var localTile = getTileInViewport(Math.floor(loc.x), Math.floor(loc.y));
            var localTile = getTileInViewport(loc.x, loc.y);
            if (localTile == null)
                continue;

            var drawX = localTile.localX - (playerSize.x / 2) + moveOffset.x;
            var drawY = localTile.localY - playerSize.y + moveOffset.y
            ctx.font = "12px Courier";
            ctx.strokeStyle = "black";
            ctx.strokeText(otherPlayer.name, drawX + (playerSize.x / 4), drawY - (playerSize.y / 20))


            ctx.drawImage(resourceMap["player"], drawX, drawY);
            if (player.name !== otherPlayer.name) {
                ctx.fillStyle = "blue";
                ctx.fillRect(localTile.localX + moveOffset.x, localTile.localY + moveOffset.y, 10, 10)

            }
        }
    }

    function getCharacterTileRemainder(loc) {
        return {
            "x": ((loc.x * 100) - (Math.floor(loc.x) * 100)) * -1 * 0.01 * tileSize,
            "y": ((loc.y * 100) - (Math.floor(loc.y) * 100)) * -1 * 0.01 * tileSize
        }
    }

    //gotta draw the world relative to the player
    function drawWorld() {
        var loc = getLocalPlayer()["location"];
        var tR = getCharacterTileRemainder(loc);
        for (var x = 0; x <= Math.ceil(width / tileSize) + 2; x++) {
            for (var y = 0; y <= Math.ceil(height / tileSize) + 2; y++) {
                ctx.fillStyle = 'black';
                var coordX = Math.floor(loc["x"]) - Math.floor((width / 2) / tileSize) + x - 2;
                var coordY = Math.floor(loc["y"]) - Math.floor((height / 2) / tileSize) + y - 2;
                var tileToRender = getTile(coordX, coordY);

                var localX = tileSize * x - tileSize;
                var localY = tileSize * y - tileSize;
                ctx.drawImage(tileToRender,
                    localX + tR.x - (tileSize / 2) + moveOffset.x,
                    localY + tR.y - (tileSize / 2) + moveOffset.y,
                    tileSize, tileSize)
                //debug coords
                var str = `${coordX},${coordY}`;
                ctx.font = "8px Courier";
                ctx.strokeStyle = "black";
                ctx.strokeText(str,
                    localX + tR.x - (tileSize / 4) + moveOffset.x,
                    localY + tR.y + moveOffset.y);
            }
        }
    }

    function drawOutlineAroundGame() {
        var topLeft = { "x": 0, "y": 0 }
        var topRight = { "x": width - 2, "y": 0 }
        var bottomLeft = { "x": 0, "y": height - 2 }
        ctx.fillStyle = 'blue';
        //line from top left to top right
        ctx.fillRect(topLeft.x, topLeft.y, width, 2);
        //line from top left to bottom left
        ctx.fillRect(topLeft.x, topLeft.y, 2, height);
        //bottom left to bottom right
        ctx.fillRect(bottomLeft.x, bottomLeft.y, width, 2);
        //top right to bottom right
        ctx.fillRect(topRight.x, topRight.y, 2, height)
    }

    function getTileInViewport(x, y) {
        var loc = getLocalPlayer()["location"];

        var minCoordX = Math.floor(loc["x"]) - Math.floor((width / 2) / tileSize);
        var maxCoordX = Math.floor(loc["x"]) - Math.floor((width / 2) / tileSize) + (width / tileSize);
        var minCoordY = Math.floor(loc["y"]) - Math.floor((height / 2) / tileSize);
        var maxCoordY = Math.floor(loc["y"]) - Math.floor((height / 2) / tileSize) + (height / tileSize);
        if (Math.floor(loc["x"]) > minCoordX && Math.floor(loc["x"]) < maxCoordX && Math.floor(loc["y"]) > minCoordY && Math.floor(loc["y"]) < maxCoordY)
            return { "localX": ((x - loc.x - 0.5) * tileSize) + (width / 2) - (tileSize / 2) + tileSize, "localY": ((y - loc.y - 0.5) * tileSize) + (height / 2) + tileSize }
        return null;
    }

    //clicking functions & handler below
    function relativeMousePos(mouseEvent) {
        //player.location.x = Math.round(player.location.x * 100.0) / 100.0;
        const rect = canvas.getBoundingClientRect();
        var x = Math.abs(Math.floor(mouseEvent.clientX - rect.left));
        var y = Math.abs(Math.floor(mouseEvent.clientY - rect.top));
        return { "x": x, "y": y };
    }

    function mouseToRelativeTile(relativeMousePos) {
        relativeMousePos.x += (moveOffset.x * -1);
        relativeMousePos.y += (moveOffset.y * -1);

        relativeMousePos.x /= tileSize;
        relativeMousePos.y /= tileSize;
        relativeMousePos.x -= (width / tileSize) / 2
        relativeMousePos.y -= (height / tileSize) / 2
        relativeMousePos.x = Math.round(relativeMousePos.x * 10.0) / 10.0;
        relativeMousePos.y = Math.round(relativeMousePos.y * 10.0) / 10.0;
        return relativeMousePos;
    }

    function relativeTileToWorldTile(tile) {
        var x = Math.floor(player.location.x) + tile.x;
        var y = Math.floor(player.location.y) + tile.y;
        x = Math.round(x * 10.0) / 10.0;
        y = Math.round(y * 10.0) / 10.0;

        //bandaid math
        y -= 0.5;

        var remainder = getCharacterTileRemainder(player.location);
        remainder.x /= tileSize;
        remainder.y /= tileSize;
        remainder.x = Math.abs(Math.floor(remainder.x * 10) / 10);
        remainder.y = Math.abs(Math.floor(remainder.y * 10) / 10);

        x += remainder.x;
        y += remainder.y;
        x = Math.floor(x * 10.0) / 10.0;
        y = Math.floor(y * 10.0) / 10.0;
        return { "x": x, "y": y };
    }

    // canvas.addEventListener('mousedown')

    canvas.addEventListener('click', (e) => {
        canvas.focus();
        var rPos = mouseToRelativeTile(relativeMousePos(e));
        var pos = relativeTileToWorldTile(rPos);
        // addTempDraw(pos.x, pos.y);
        console.log(`rPos: clicked! x: ${rPos.x} y: ${rPos.y}`);
        console.log(`pos: clicked! x: ${pos.x} y: ${pos.y}`);
        console.log("move offset")
        console.log(moveOffset)
        emitPlayerTileDestination(pos)
    });

    //render clock
    var clock;
    function renderClock() {
        if (clock) {
            clearInterval(clock);
            clock = null;
        }


        clock = setInterval(() => {
            drawWorld();

            drawDestination();

            drawOtherCharacters();

            testDraw();

            drawOutlineAroundGame();
            drawCoordsTopLeft();
        }, 50);
    }

    function emitPlayerTileDestination(loc) {
        socket.emit("playerDestination", loc);
    }

    function handleGameCycle(gameCycle) {
        var newPlayers = gameCycle["players"];
        var newLocalPlayer = newPlayers[socket.id];

        //move offset from player moving
        if (player && player.destination) {
            if (player.location.x !== newLocalPlayer.location.x && moveOffset.x < tileSize && moveOffset.x > (tileSize * -1))
                moveOffset.x += (newLocalPlayer.location.x > player.location.x) ? 1 : -1;
            if (player.location.y !== newLocalPlayer.location.y && moveOffset.y < tileSize && moveOffset.y > (tileSize * -1))
                moveOffset.y += (newLocalPlayer.location.y > player.location.y) ? 1 : -1;
            moveOffset.x = moveOffset.x >= tileSize ? 39 : moveOffset.x;
            moveOffset.y = moveOffset.y >= tileSize ? 39 : moveOffset.y;
            moveOffset.x = moveOffset.x <= (tileSize * -1) ? -39 : moveOffset.x;
            moveOffset.y = moveOffset.y <= (tileSize * -1) ? -39 : moveOffset.y;
        }

        players = newPlayers;
        player = newLocalPlayer; //updating local player
    }

    //io stuff
    const socket = io();

    socket.on('connect', () => {
        console.log("im connected")

        socket.on(socket.id, (gameCycle) => handleGameCycle(gameCycle));
    });

    var loginButton = document.getElementById('loginBtn');
    loginButton.addEventListener('click', (e) => {
        var userNameInput = document.getElementById('usernameInput');
        var nameTyped = userNameInput.value;
        socket.emit("loginGame", nameTyped);
        console.log(`logged in as ${nameTyped}`);
    });

    eventBus.on('login', userObj => {
        socket.emit('loginGame', userObj.username)
    })

    socket.on('loginGame', response => {
        console.log(response);
        if (response.code != 1)
            return;
        // player = response["playerObj"];
        eventBus.post("clientLogin", {});
        renderClock()
    });

    socket.on('playerDisconnect', playerName => {
        players = players.filter(p => p.name !== playerName);
    });

    // socket.on('gameCycle', gameCycle => {
    //     handleGameCycle(gameCycle);
    // });


}

