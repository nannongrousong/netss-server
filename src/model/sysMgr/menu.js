const dbHelper = require('../../common/dbHelper');
const errorInfo = require('../../common/errorInfo');

const listSysMenu = async () => {
    let sql = 'select menu_id as MenuID,parent_id as ParentID, title as Title,path as Path,type as Type, priority as Priority,icon as Icon,remark as Remark  from tbl_sys_menu order by priority asc';
    return dbHelper.executeSql(sql)
};

const addSysMenu = async ({ Icon, ParentID, Path, Title, Type, Remark }) => {
    if (ParentID == undefined || !Type) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    if (!Path) {
        throw new Error({ node: '缺少导航名称路径', resource: '缺少资源ID' }[Type]);
    }

    if (!Title) {
        throw new Error({ node: '缺少导航名称', resource: '缺少资源名称' }[Type]);
    }

    let sql = 'select count(menu_id) as count from tbl_sys_menu where path = ? ';
    let params = [Path];

    let data = await dbHelper.executeSql(sql, params);
    if (data[0].count > 0) {
        throw new Error('路径值必须唯一！');
    }

    //  由于path值可以为空，不能通过建立path约束来限制插入

    sql = 'insert into tbl_sys_menu(icon,parent_id,path,title,type,remark) values(?,?,?,?,?,?)';
    params = [Icon, ParentID, Path, Title, Type, Remark];

    await dbHelper.executeSql(sql, params);
};

const delSysMenu = async (menuID) => {
    if (menuID == undefined) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    let sql = 'select parent_id from tbl_sys_menu where menu_id = ?';
    let params = [menuID]
    let data = await dbHelper.executeSql(sql, params);
    let parentID = data[0].parent_id;

    if (parentID == 0) {
        throw new Error('根节点不允许删除！');
    }

    let sqlList = [{
        sql: 'delete from tbl_sys_menu where menu_id = ?',
        params: [menuID]
    }, {
        sql: 'delete from tbl_role_rela_menu where menu_id = ?',
        params: [menuID]
    }]

    await dbHelper.executeTransaction(sqlList);
};

const editSysMenu = async ({ MenuID, Icon, ParentID, Path, Title, Type, Remark, Priority }) => {
    if (MenuID == undefined || ParentID == undefined) {
        throw new Error(errorInfo.PARAM_INCOMPLETE)
    }

    //  当前节点的
    let sql = 'select count(1) as count from tbl_sys_menu where parent_id = ?'
    let params = [MenuID]

    let res  = await dbHelper.executeSql(sql, params);

    if(res[0].count == 0 && !Path) {
        throw new Error({ node: '缺少导航路径', resource: '缺少资源ID' }[Type]);
    }

    if (!Title) {
        throw new Error({ node: '缺少导航名称', resource: '缺少资源名称' }[Type]);
    }

    sql = 'update tbl_sys_menu set icon=?,path=?,title=?,remark=?,priority=?,parent_id=? where menu_id=?';
    params = [Icon, Path, Title, Remark, Priority, ParentID, MenuID]

    await dbHelper.executeSql(sql, params);
};

module.exports = {
    listSysMenu,
    addSysMenu,
    delSysMenu,
    editSysMenu
}