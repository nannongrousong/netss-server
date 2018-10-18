const express = require('express')
const router = express.Router();
const demoM = require('../model/demo')
const { getErrorInfo } = require('../common/utils');

router.get('/Table', async (req, res) => {
    const { index = 0, size = 10 } = req.query;
    try {
        let data = await demoM.listUser({ index, size });
        let [RecordCount, RecordList] = data;
        RecordList.forEach((item) => {
            item.Tag = item.Tag ? item.Tag.split(',') : [];
        });
        res.json({ Code: true, Data: { RecordList, RecordCount } });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.put('/Table', async (req, res) => {
    let userInfo = {
        ...req.body,
        Tag: (req.body.Tag || []).join(',')
    };
    try {
        await demoM.editUser(userInfo);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.post('/Table', async (req, res) => {
    let userInfo = {
        ...req.body,
        Tag: (req.body.Tag || []).join(',')
    };

    try {
        await demoM.addUser(userInfo);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.delete('/Table/:userID', async (req, res) => {
    let { userID } = req.params;
    try {
        await demoM.delUser(userID);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

module.exports = router;