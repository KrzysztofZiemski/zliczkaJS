
const express = require('express');
const path = require('path');
const PERMISSION = require('../consts');
const checkPermission = require('../middlewares/authMiddleware')
const UserController = require('../constrollers/userController');

class UserRouter {

    // api/users

    constructor() {
        this.router = express.Router();
        this.routes()
    }

    routes() {
        this.router.get('/employees', checkPermission(PERMISSION.ADMIN), this.getEmployees.bind(this))
        this.router.put('/activate/:id', checkPermission(PERMISSION.ADMIN), this.activateUser.bind(this))
        this.router.get('/self', checkPermission(PERMISSION.USER), this.getSelf.bind(this))
        this.router.get('/:id', checkPermission(PERMISSION.ADMIN), this.get.bind(this))
        this.router.post('/', checkPermission(PERMISSION.ADMIN), this.add.bind(this))
        this.router.delete('/:id', checkPermission(PERMISSION.ADMIN), this.remove.bind(this))
    }
    async activateUser(req, res) {

        try {
            const { active, password, permission, created, ...other } = await new UserController().activate(req.params.id);
            res.status(200).json(other)
        } catch (err) {
            res.status(500).json(err)
        }
    }
    async get(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).send('niepoprawne dane')
        try {
            const response = await new UserController().get({ _id: id });
            console.log('response')
            res.status(200).json(response)
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
            res.status(err.status || 500).json(err)
        }
    }
    getSelf(req, res) {
        const { name, lastName, id } = req.token
        if (!name || !lastName || !id) return res.status(401).send('not authorized')
        res.status(200).json({ name, lastName, id })

    }
    async getEmployees(req, res) {
        try {
            const response = await new UserController().getEmployees();

            res.status(200).json(response)
        } catch (err) {
            res.status(500).json(err)
        }

    }
}


module.exports = UserRouter;