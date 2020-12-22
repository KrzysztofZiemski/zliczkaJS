
const express = require('express');
const path = require('path');
const checkPermission = require('../middlewares/authMiddleware');
const { PERMISSION } = require('../consts')
//err
class TemplatesRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /
    routes() {
        this.router.get('/management/users', checkPermission(10), this.adminUsers);
        this.router.get('/management/tasks', checkPermission(10), this.adminTasks);
        this.router.get('/management', checkPermission(10), this.admin);
        this.router.get('/management/*', checkPermission(10), this.admin);
        this.router.get('/dashboard/*', checkPermission(1), this.dashboard);
        this.router.get('/', checkPermission(), this.redirect);
    }

    adminTasks(req, res) {
        res.sendFile(path.resolve(__dirname, "../../build/management/admin-tasks.html"));
    }
    adminUsers(req, res) {
        res.sendFile(path.resolve(__dirname, "../../build/management/admin-users.html"));
    }
    dashboard(req, res) {
        res.sendFile(path.resolve(__dirname, "../../build/dashboard"));
    }

    admin(req, res) {
        //weryfikacja tokenu
        res.sendFile(path.resolve(__dirname, "../../build/management/admin.html"));
    }
    redirect(req, res) {
        if (req.token.permission === PERMISSION.ADMIN) return res.redirect('/management')
        if (req.token.permission === PERMISSION.USER) return res.redirect('/dashboard')
    }
}

module.exports = TemplatesRouter;