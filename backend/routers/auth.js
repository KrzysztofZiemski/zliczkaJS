const { Console } = require('console');
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const loginFake = 'admin';
const PERMISSION = require('../consts');
const passwordFake = '$2a$10$bZ/Eu9zWOVjqS6XChY6LCuQbw0X9Y5Il7tiheNZxnQfVLcWyg7xo.' //admin
const fakeUser = {
    id: 1,
    name: 'admin',
    lastName: 'admin',
    mail: 'admin',
    permission: PERMISSION.ADMIN,
}
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
        const correctPassword = await bcrypt.compare(password, passwordFake);

        if (login === loginFake && correctPassword) {
            console.log('weszło')
            res.cookie('user', JSON.stringify(fakeUser)).status(200)
        } else {
            res.status(401).send('błędny login lub hasło')
        }


        // if (login === loginFake && checkedPassword) {
        //     console.log('weszło')
        //     // res.redirect('/')
        //     res.cookie('token', '1234', {
        //         maxAge: 36000000,
        //         httpOnly: true
        //     });
        //     res.send('sss')
        // }
        // res.status(200).send('aaa')
    }
    test(req, res) {

        res.send('dddd')
    }
}

module.exports = AuthRouter;