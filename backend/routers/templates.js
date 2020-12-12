
const express = require('express');
const path = require('path');


class TemplatesRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /
    routes() {
        this.router.get('/admin/users', this.adminUsers);
        this.router.get('/admin', this.admin);

    }
    adminUsers(req, res) {
        console.log('weszło users')
        res.sendFile(path.resolve(__dirname, "../../build/admin/admin-users.html"));
    }

    admin(req, res) {
        console.log('weszło admin')
        //weryfikacja tokenu
        res.sendFile(path.resolve(__dirname, "../../build/admin/admin.html"));
    }
}

module.exports = TemplatesRouter;