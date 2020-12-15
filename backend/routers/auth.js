const express = require('express');
const AuthController = require('../constrollers/authController');

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    //api/auth

    routes() {
        this.router.post('/', this.login.bind(this))
        this.router.get('/', this.test.bind(this))
    }

    async login(req, res) {
        const { login, password } = req.body;

        const response = await new AuthController().auth(login, password)
    }
    test(req, res) {

        res.send('dddd')
    }
}

module.exports = AuthRouter;