const dbHelper = require('../common/dbHelper');
const errorInfo = require('../common/errorInfo');

const listUserMenu = async (userID) => {
    if (!userID) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    let sql = `select menu_id as MenuID, parent_id as ParentID, title as Title, path as Path, type as Type, icon as Icon from tbl_sys_menu  where menu_id in 
    (select menu_id from tbl_role_rela_menu rela2 where role_id in
    (select role_id from tbl_user_rela_role rela1 where rela1.user_id = ?))
    order by priority asc`;
    let params = [userID]

    return dbHelper.executeSql(sql, params);
}

const saveRoleMenu = async ({ roleID, menuIDs }) => {
    if (!roleID) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    let sqlList = [{
        sql: 'delete from tbl_role_rela_menu where role_id = ?',
        params: [roleID]
    }];

    menuIDs.forEach((menuID) => {
        sqlList.push({
            sql: 'insert into tbl_role_rela_menu(role_id,menu_id) values(?,?)',
            params: [roleID, menuID]
        });
    })

    await dbHelper.executeTransaction(sqlList);
};

const listRoleMenu = async (roleID) => {
    if (!roleID) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    let sql = `select ifnull(group_concat(menu.menu_id), '') as MenuIDs from tbl_role role
        left join tbl_role_rela_menu menu 
        on menu.role_id = role.role_id and role.role_id = ?`;
    return dbHelper.executeSql(sql, roleID);
}

module.exports = {
    listUserMenu,
    listRoleMenu,
    saveRoleMenu
}