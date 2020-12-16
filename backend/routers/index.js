
const express = require('express');
const path = require('path');
const TasksRouter = require(path.resolve(__dirname, './tasks'));
const ReportsRouter = require(path.resolve(__dirname, './reports'));
const AuthRouter = require(path.resolve(__dirname, './auth'))
const UserRouter = require(path.resolve(__dirname, './users'))

class AppRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /api

    routes() {
        this.router.use('/tasks', new TasksRouter().router);
        this.router.use('/reports', new ReportsRouter().router);
        this.router.use('/auth', new AuthRouter().router);
        this.router.use('/users', new UserRouter().router)
    }
}

module.exports = AppRouter;