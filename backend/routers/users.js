
const express = require('express');
const path = require('path');
const permission = require('../consts');
const UserController = require('../constrollers/userController');

class UserRouter {

    // api/users

    constructor() {
        this.router = express.Router();
        this.routes()
    }

    routes() {
        this.router.get('/:id', this.get.bind(this))
        this.router.post('/', this.add.bind(this))
    }

    add(req, res) {
        //TODO walidacja danych
        // const { login, name, lastName, mail, permission, password } = req.body;

        // if (!login || !name || !lastName || !mail || !permission || !password) return res.status(400).send('błędne dane')

        // new UserController().addUser({ login, name, lastName, mail, permission, password })
        new UserController().addUser()
    }
    get(req, res) {

    }
}


module.exports = UserRouter;