const dbHelper = require('../../common/dbHelper');
const errorInfo = require('../../common/errorInfo');
const { encryptData } = require('../../common/utils');
const { defaultPwd } = require('../../config/global');

const listSysUser = async () => {
    let sql = `select user.user_id as UserID,user.login_name as LoginName,user.nick_name as NickName,user.is_valid as IsValid,
        GROUP_CONCAT(role.role_id separator '||') as Role
        from tbl_user user
        left join tbl_user_rela_role rela on user.user_id = rela.user_id
        left join tbl_role role on rela.role_id = role.role_id
        group by user.user_id;`;

    return dbHelper.executeSql(sql)
}

const addSysUser = async ({ IsValid, LoginName, NickName, Password, Role }) => {
    if (IsValid == undefined) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    if (!LoginName) {
        throw new Error('缺少登录名')
    }

    if (!NickName) {
        throw new Error('缺少昵称')
    }

    if (!Password) {
        throw new Error('缺少密码')
    }

    if (!Role) {
        throw new Error('缺少角色')
    }

    let sqlList = [{
        sql: 'insert into tbl_user(login_name,nick_name,is_valid,password) values(?,?,?,?)',
        params: [LoginName, NickName, IsValid, encryptData(Password)]
    }]

    Role.forEach((roleID) => {
        sqlList.push({
            sql: 'insert into tbl_user_rela_role(role_id,user_id) values(?,@@user_id)',
            params: [roleID]
        })
    })

    await dbHelper.executeTransaction(sqlList, {
        sqlResIndex: 0,
        sqlAfterReplaceStr: '@@user_id'
    });
}

const delSysUser = async (userID) => {
    if (userID == undefined) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    let sqlList = [{
        sql: 'delete from tbl_user where user_id = ?',
        params: [userID]
    }, {
        sql: 'delete from tbl_user_rela_role where user_id = ?',
        params: [userID]
    }]

    await dbHelper.executeTransaction(sqlList)
}

const editSysUser = async ({ UserID, LoginName, NickName, IsValid, Role }) => {
    if (UserID == undefined || IsValid == undefined) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    if (!LoginName) {
        throw new Error('缺少登录名')
    }

    if (!NickName) {
        throw new Error('缺少昵称')
    }

    if (!Role) {
        throw new Error('缺少角色')
    }

    let sqlList = [{
        sql: 'update tbl_user set login_name=?,nick_name=?,is_valid=? where user_id=?',
        params: [LoginName, NickName, IsValid, UserID]
    }];

    if (Role.length > 0) {
        sqlList.push({
            sql: 'delete from tbl_user_rela_role where user_id = ?',
            params: [UserID]
        })
        Role.forEach((roleID) => {
            sqlList.push({
                sql: 'insert into tbl_user_rela_role(role_id,user_id) values(?,?)',
                params: [roleID, UserID]
            })
        })
    }

    try {
        await dbHelper.executeTransaction(sqlList)
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            throw new Error('登录名称不允许重复，请重新再试！');
        }
        throw err;
    }
}

const checkUser = async (loginName, password) => {
    if (!loginName) {
        throw new Error('缺少登录名')
    }

    if (!password) {
        throw new Error('缺少密码')
    }

    let sql = 'select user_id as userID, nick_name as nickName,is_valid as isValid from tbl_user where login_name = ? and password = ?';
    let params = [loginName, password]
    let data = await dbHelper.executeSql(sql, params);
    return data.length ? data[0] : null;
}

const getUserInfo = async (userID) => {
    if (userID == undefined) {
        throw errorInfo.PARAM_INCOMPLETE
    }

    let sql = `select login_name as LoginName,nick_name as NickName,is_valid as IsValid,group_concat(role.name) as RoleName from tbl_user user
        left join tbl_user_rela_role rela on user.user_id = rela.user_id
        left join tbl_role role on rela.role_id = role.role_id
        where user.user_id = ? group by login_name`;
    let params = [userID]

    let data = await dbHelper.executeSql(sql, params);
    return data[0];
}

const resetUserPwd = async ({ UserID }) => {
    if (UserID == undefined) {
        throw errorInfo.PARAM_INCOMPLETE
    }

    let sql = 'update tbl_user set password = ? where user_id = ?';
    let params = [encryptData(defaultPwd), UserID];

    await dbHelper.executeSql(sql, params);
}

const editSysUserPwd = async ({ OldPwd, NewPwd1, NewPwd2, UserID }) => {
    if (!OldPwd) {
        throw new Error('请输入旧密码！');
    }

    if (!NewPwd1 || !NewPwd2) {
        throw new Error('请输入新密码！');
    }

    if (NewPwd1 != NewPwd2) {
        throw new Error('两次输入密码不一致！');
    }

    let sql = 'select count(1) as count from tbl_user where user_id = ? and password = ?'
    let params = [UserID, encryptData(OldPwd)];

    let res = await dbHelper.executeSql(sql, params);

    if (res[0].count == 0) {
        throw new Error('旧密码输入错误！')
    }

    sql = 'update tbl_user set password = ? where user_id = ?'
    params = [encryptData(NewPwd1), UserID]

    await dbHelper.executeSql(sql, params)
}

module.exports = {
    listSysUser,
    addSysUser,
    delSysUser,
    editSysUser,
    checkUser,
    getUserInfo,
    resetUserPwd,
    editSysUserPwd
}