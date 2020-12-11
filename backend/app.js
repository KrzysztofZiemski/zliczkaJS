const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db/connection');

const AppRouters = require('./routers');

class App {

    constructor() {
        this.httpApp = express();
        this.httpApp.use(cors({ origin: 'https://zliczka.herokuapp.com/', credentials: true, }))
        this.httpApp.use(cookieParser());
        this.httpApp.use(bodyParser.urlencoded({ extended: false }))
        this.httpApp.use(bodyParser.json())
        this.httpApp.use('/api', bodyParser.json(), new AppRouters().router);
        this.httpApp.use(express.static(path.join(__dirname, '../dist')));
        this.port = process.env.PORT || 8080;
        connection()
        this.stratServer(this.port).then(() => {
            console.log(`server runned on port ${this.port}`);
        })

    }

    stratServer(port) {
        return new Promise((resolve) => {
            this.httpApp.listen(port, () => {
                resolve();
            })
        });
    }
}

const app = new App();