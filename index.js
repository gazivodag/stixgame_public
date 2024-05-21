require('dotenv').config()

const ExpressManager = require("./server/web/ExpressManager");
const GameManager = require("./server/game/GameManager");
const SocketManager = require("./server/socket/SocketManager");

const port = process.env.PORT | 3000;

var eM = new ExpressManager(),
    gM = new GameManager(),
    sM = new SocketManager(eM.getServer(), gM);
gM.setSocketManager(sM)

console.log("yo")

eM.getServer().listen(port, () => {
    console.log(`StixGame listening on port ${port}`);
});