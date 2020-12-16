const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db/connection');
require('dotenv').config();

const AppRouters = require('./routers');
const TemplatesRouter = require('./routers/templates');

class App {

    constructor() {
        this.httpApp = express();
        this.httpApp.use(cors())
        this.httpApp.use(cookieParser());
        this.httpApp.use(bodyParser.urlencoded({ extended: false }))
        this.httpApp.use(bodyParser.json())
        this.httpApp.use('/api', bodyParser.json(), new AppRouters().router);
        this.httpApp.use('/', new TemplatesRouter().router);
        this.httpApp.use(express.static(path.join(__dirname, '../build')));


        this.port = process.env.PORT || 8080;
        connection();

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