
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
        this.router.get('/employees', this.getEmployees.bind(this))
        this.router.put('/activate/:id', this.activateUser.bind(this))
        this.router.get('/:id', this.get.bind(this))
        this.router.post('/', this.add.bind(this))
        this.router.delete('/:id', this.remove.bind(this))
    }
    async activateUser(req, res) {

        try {
            const { active, password, permission, created, ...other } = await new UserController().activate(req.params.id);
            res.status(200).json(other)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async remove(req, res) {
        try {
            const { active, password, permission, created, ...other } = await new UserController().removeEmployee(req.params.id);
            res.status(200).json(other)
        } catch (err) {
            res.status(500).json(err)
        }

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
            // console.log(err)
            res.status(err.status || 500).json(err)
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