const express = require('express')
const router = express.Router();
const { secret, publicPath } = require('../config/global');
const jwt = require('jsonwebtoken');
const userM = require('../service/sysMgr/user')
const authorityM = require('../service/authority');

const { getErrorInfo, encryptData, getUserIDByHeaders } = require('../common/utils');

router.post('/CMS_Login', async (req, res) => {
    let { loginName, password } = req.body;
    password = encryptData(password);
    //  verify loginName & password
    try {
        let userInfo = await userM.checkUser(loginName, password);
        if (userInfo) {
            if (userInfo.isValid == 0) {
                res.json({ Code: false, Info: '用户暂时被禁用，请联系管理员！' });
            } else {
                const token = jwt.sign({
                    loginName,
                    userID: userInfo.userID
                }, secret, {
                        expiresIn: '1d'
                    }
                );
                res.json({
                    Code: true, Data: {
                        token,
                        nickName: userInfo.nickName
                    }
                });
            }
        } else {
            res.json({ Code: false, Info: '请检查登录名或密码！' });
        }
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

router.get('/Load_User_Info', async (req, res) => {
    try {
        const userID = getUserIDByHeaders(req.headers);
        const [userInfo, userMenu] = await Promise.all([
            userM.getUserInfo(userID),
            authorityM.listUserMenu(userID)
        ]);

        let showMenu = [];
        let showResource = [];
        userMenu.forEach((menu) => {
            const { Type, Icon } = menu;

            if (Type == 'resource') {
                showResource.push(menu);
            }

            if (Type == 'node') {
                if (/\.(png|jpe?g|gif|svg)$/.test(Icon)) {
                    menu.Icon = `${publicPath}/Attach/${Icon}`;
                }

                showMenu.push(menu);
            }
        });

        res.json({
            Code: true, Data: {
                Menu: showMenu,
                Resource: showResource,
                NickName: userInfo.NickName,
                RoleName: userInfo.RoleName
            }
        })
    } catch (err) {
        res.json({ Code: false, Info: getErrorInfo(err) });
    }
});

module.exports = router;