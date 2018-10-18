const dbHelper = require('../../common/dbHelper');
const errorInfo = require('../../common/errorInfo');

const listSysRole = async () => (dbHelper.executeSql('select role_id as RoleID, name as RoleName, remark as Remark from tbl_role'));

const addSysRole = async ({ RoleName, Remark }) => {
    if (!RoleName) {
        throw new Error('缺少角色名称')
    }
    let sql = 'insert into tbl_role(name,remark) values(?,?)'
    let params = [RoleName, Remark]

    await dbHelper.executeSql(sql, params);
};

const delSysRole = async (roleID) => {
    if (roleID == undefined) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    let sqlList = [{
        sql: 'delete from tbl_role where role_id = ?',
        params: [roleID]
    }, {
        sql: 'delete from tbl_role_rela_menu where role_id = ?',
        params: [roleID]
    }, {
        sql: 'delete from tbl_user_rela_role where role_id = ?',
        params: [roleID]
    }]
    await dbHelper.executeTransaction(sqlList);
};

const editSysRole = async ({ RoleID, RoleName, Remark }) => {
    if (RoleID == undefined) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    if (!RoleName) {
        throw new Error('缺少角色名称')
    }

    let sql = 'update tbl_role set name=?,remark=? where role_id=?'
    let params = [RoleName, Remark, RoleID]

    try {
        await dbHelper.executeSql(sql, params);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            throw new Error('角色名称不允许重复，请重新再试！');
        }
        throw err;
    }
};

module.exports = {
    listSysRole,
    addSysRole,
    delSysRole,
    editSysRole
}