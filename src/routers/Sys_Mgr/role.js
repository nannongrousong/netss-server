const express = require('express')
const router = express.Router();
const roleM = require('../../service/sysMgr/role');
const { getErrorInfo } = require('../../common/utils');

router.get('/', async (req, res) => {
    try {
        let Data = await roleM.listSysRole();
        res.json({ Code: true, Data });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.post('/', async (req, res) => {
    try {
        await roleM.addSysRole(req.body);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.delete('/:roleID', async (req, res) => {
    let { roleID } = req.params;
    try {
        await roleM.delSysRole(roleID);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.put('/', async (req, res) => {
    try {
        await roleM.editSysRole(req.body)
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

module.exports = router;