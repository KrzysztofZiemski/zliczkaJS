
const express = require('express');
const path = require('path');
const permission = require('../consts');
const UserController = require('../constrollers/userController');
const { Console } = require('console');

class UserRouter {

    // api/users

    constructor() {
        this.router = express.Router();
        this.routes()
    }

    routes() {
        this.router.get('/employees', this.getEmployees.bind(this))
        this.router.get('/:id', this.get.bind(this))
        this.router.post('/', this.add.bind(this))
    }

    async add(req, res) {
        //TODO walidacja danych

        const data = req.body;

        if (!data.login, !data.name, !data.lastName, !data.mail, !data.password) return res.status(400).send('błędne dane')
        const { login, name, lastName, mail, password } = data;

        try {
            const responseUser = await new UserController().addUser({ login, name, lastName, mail, password });

            res.status(200).json({
                id: responseUser._id,
                login: responseUser.login,
                name: responseUser.name,
                lastName: responseUser.lastName,
                mail: responseUser.mail,
                created: responseUser.created
            })
        } catch (err) {
            res.status(500).json(err)
        }
    }
    get(req, res) {

    }
    async getEmployees(req, res) {
        try {
            const response = await new UserController().getEmployees();
            res.status(200).json(response)
        } catch (err) {
            console.log('err', err)
            res.status(500).json(err)
        }

    }
}


module.exports = UserRouter;