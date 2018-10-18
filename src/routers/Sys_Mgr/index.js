const express = require('express')
const router = express.Router();

const menuRouter = require('./menu')
const roleRouter = require('./role')
const userRouter = require('./user')
const roleMenuRouter = require('./roleMenu')

router.use('/Menu', menuRouter);
router.use('/Role', roleRouter);
router.use('/User', userRouter);
router.use('/Role_Menu', roleMenuRouter);

module.exports = router;