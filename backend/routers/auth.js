const express = require('express');
const AuthController = require('../constrollers/authController');
const { PERMISSION } = require('../consts');
const EXPIRE_COOKIE = 28800000; //8 hour
class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    //api/auth

    routes() {
        this.router.post('/', this.login.bind(this))
        this.router.get('/logout', this.logout.bind(this))
    }
    async logout(req, res) {
        res.cookie('token', '').status(200).json('logout')
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;
            const response = await new AuthController().auth(login, password)
            const dateExpired = Date.now() + EXPIRE_COOKIE;
            res.cookie('token', response.token, { httpOnly: true, maxAge: EXPIRE_COOKIE }).status(200)
            if (PERMISSION.ADMIN === response.permission) return res.redirect('/management')
            if (PERMISSION.USER === response.permission) return res.redirect('/dashboard')

        } catch (err) {
            res.status(err.status || 500).json(err)
        }
    }
}

module.exports = AuthRouter;