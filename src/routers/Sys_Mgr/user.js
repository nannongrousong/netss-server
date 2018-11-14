const express = require('express')
const router = express.Router();
const userM = require('../../service/sysMgr/user');
const { getErrorInfo, getUserIDByHeaders } = require('../../common/utils');

router.post('/', async (req, res) => {
    try {
        await userM.addSysUser(req.body);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.get('/', async (req, res) => {
    try {
        let Data = await userM.listSysUser();
        Data.forEach((user) => {
            const { Role } = user;
            user.Role = Role ? Role.split('||').map((id) => (id * 1)) : [];
        })
        res.json({ Code: true, Data });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.delete('/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        await userM.delSysUser(userID);
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.put('/', async (req, res) => {
    try {
        await userM.editSysUser(req.body)
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.put('/Reset_Pwd', async (req, res) => {
    try {
        await userM.resetUserPwd(req.body)
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

router.post('/Edit_Pwd', async (req, res) => {
    let UserID = getUserIDByHeaders(req.headers);
    try {
        await userM.editSysUserPwd({...req.body, UserID});
        res.json({ Code: true });
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
})

module.exports = router;