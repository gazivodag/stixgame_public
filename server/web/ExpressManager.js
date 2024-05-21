const express = require('express');
const path = require('path');
const http = require('http');


class ExpressManager {

    app;
    server;

    constructor() {
        this.init();
    }

    init() {
        this.app = express();
        this.server = http.createServer(this.app);

        this.app.set('trust proxy', true)

        this.app.use(express.static('public'))

        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../views/index.html'))
        })

        this.app.get('/test', (req, res) => {
            res.sendFile(path.join(__dirname, '../../views/test.html'))
        })
    }

    getServer() {
        return this.server;
    }

}

module.exports = ExpressManager;



