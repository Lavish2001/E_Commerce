const { sequelize } = require("../../Models/index");
const User = require('../../Models/user');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');


module.exports = class userController {


    // Login User

    async logUser(req, res) {
        if (req.body.email && req.body.password) {
            const find = await User.findOne({ where: { user_email: req.body.email } });
            if (find) {
                if (find.password === req.body.password) {
                    const token = await jwt.sign({ userId: find.id }, 'zxcvbnm');
                    res.status(200).json(token);
                } else {
                    res.status(400).json({ 'status': 'failed', 'message': 'wrong password' })
                }
            } else {
                res.status(400).json({ 'status': 'failed', 'message': 'email not exists' })
            }
        } else {
            return res.status(400).json({ 'status': 'failed', 'message': 'all fields required' })
        }
    }




    // Create User

    async makeUser(req, res) {
        const admin = await User.findOne({ where: { user_email: req.user.user_email } });
        if (admin.admin) {
            if (req.body.email && req.body.password) {
                const exist = await User.findOne({ where: { user_email: req.body.email } });
                if (exist) {
                    return res.status(400).json({ 'status': 'failed', 'message': 'email already exists' })
                } else {
                    await User.create({
                        user_email: req.body.email,
                        password: req.body.password,
                        admin: req.body.admin ? req.body.admin : false
                    });
                    return res.status(200).json({ 'status': 'success', 'message': 'user created' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'fill all required fields' })
            }
        } else { return res.status(400).json({ 'status': 'failed', 'message': 'only admin add new user' }) }
    }




    // Only Admin See This EJS Template

    async common(req, res) {
        if (req.user.admin === true) {
            return res.status(200).json({ 'status': 'success' });
        } else {
            return res.status(400).json({ 'status': 'failed', 'message': 'only admin see this page' })
        }
    }

};



