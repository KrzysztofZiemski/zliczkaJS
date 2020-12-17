const express = require('express');
const AuthController = require('../constrollers/authController');
const { PERMISSION } = require('../consts');

class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    //api/auth

    routes() {
        this.router.post('/', this.login.bind(this))
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;
            const response = await new AuthController().auth(login, password)
            res.cookie('token', response.token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 }).status(200)
            if (PERMISSION.ADMIN) return res.redirect('/admin')
            if (PERMISSION.USER) return res.redirect('/')

        } catch (err) {
            res.status(err.status || 500).json(err)
        }

    }
}

module.exports = AuthRouter;