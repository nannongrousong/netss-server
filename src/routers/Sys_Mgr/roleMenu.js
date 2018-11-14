const express = require('express')
const router = express.Router();
const authorityM = require('../../service/authority');

const { getErrorInfo } = require('../../common/utils');

router.post('/', async (req, res) => {
    try {
        await authorityM.saveRoleMenu(req.body);
        res.json({ Code: true })
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.get('/', async (req, res) => {
    try {
        const { roleID } = req.query;
        let data = await authorityM.listRoleMenu(roleID);
        const { MenuIDs } = data[0];
        res.json({ Code: true, Data: MenuIDs ? MenuIDs.split(',') : [] })
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

module.exports = router;