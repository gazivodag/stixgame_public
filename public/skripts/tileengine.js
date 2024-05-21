class TileEngine {
    eventBus;
    document;

    //hardcoded for now
    resourceMap;
    gameMap = [25, 25]; //50*50 tiles

    constructor(eventBus, document)
    {
        this.eventBus = eventBus;
        this.document = document;
        this.initResourceMap();
    }

    initResourceMap()
    {
        this.resourceMap = {
            "player": this.document.getElementById('stickmanImg'),
            "grass": this.document.getElementById('grassImg'),
            "ooa": this.document.getElementById('ooaImg'),
        };
    }

    getTileTexture(x, y) {
        if (x < 0 || y < 0 || x > this.gameMap[0] - 1 || y > this.gameMap[1] - 1)
            return this.resourceMap["ooa"];
        return this.resourceMap["grass"];
    }

}