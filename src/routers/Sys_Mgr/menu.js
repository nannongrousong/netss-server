const express = require('express')
const router = express.Router();
const menuM = require('../../service/sysMgr/menu');
const { getErrorInfo } = require('../../common/utils');
const { publicPath } = require('../../config/global')

router.get('/', async (req, res) => {
    try {
        let data = await menuM.listSysMenu();
        data.forEach((menu) => {
            const { Icon } = menu;

            if (/\.(png|jpe?g|gif|svg)$/.test(Icon)) {
                menu.Icon = `${publicPath}/Attach/${Icon}`;
            }
        });
        res.json({ Code: true, Data: data });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.post('/', async (req, res) => {
    try {
        await menuM.addSysMenu(req.body);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.delete('/:menuID', async (req, res) => {
    let { menuID } = req.params;
    try {
        await menuM.delSysMenu(menuID);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.put('/', async (req, res) => {
    try {
        await menuM.editSysMenu(req.body)
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

module.exports = router;