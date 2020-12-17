
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
        this.router.get('/admin/users', checkPermission(10), this.adminUsers);
        this.router.get('/admin/tasks', checkPermission(10), this.adminTasks);
        this.router.get('/admin/*', checkPermission(10), this.admin);
        this.router.get('/dashboard/*', checkPermission(1), this.dashboard);
        this.router.get('/', checkPermission(), this.redirect);
    }
    adminTasks(req, res) {
        res.sendFile(path.resolve(__dirname, "../../build/admin/admin-tasks.html"));
    }
    adminUsers(req, res) {
        res.sendFile(path.resolve(__dirname, "../../build/admin/admin-users.html"));
    }
    dashboard(req, res) {
        res.sendFile(path.resolve(__dirname, "../../build/dashboard"));
    }

    admin(req, res) {
        //weryfikacja tokenu
        res.sendFile(path.resolve(__dirname, "../../build/admin/admin.html"));
    }
    redirect(req, res) {
        if (req.token.permission === PERMISSION.ADMIN) return res.redirect('/admin')
        if (req.token.permission === PERMISSION.USER) return res.redirect('/dashboard')
    }
}

module.exports = TemplatesRouter;